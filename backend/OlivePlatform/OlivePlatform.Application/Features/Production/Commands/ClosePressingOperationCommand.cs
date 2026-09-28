using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class ClosePressingOperationCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        // Huile produite (L), décimale.
        public decimal OilQuantity { get; set; }
    }

    public class ClosePressingOperationCommandHandler
    : IRequestHandler<ClosePressingOperationCommand, Unit>
    {

        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;
        private readonly ISeasonService _seasonService;
        private readonly IOliveLotService _oliveLotService;
        private readonly IPressingParametersRepository _parametersRepository;

        public ClosePressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository,
            ISeasonService seasonService,
            IOliveLotService oliveLotService,
            IPressingParametersRepository parametersRepository)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
            _seasonService = seasonService;
            _oliveLotService = oliveLotService;
            _parametersRepository = parametersRepository;
        }

        public async Task<Unit> Handle(
    ClosePressingOperationCommand request,
    CancellationToken cancellationToken)
        {
            var pressingOperation = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            var now = DateTime.UtcNow;

            if (pressingOperation is null)
            {
                throw new KeyNotFoundException(
                    $"Pressing operation {request.Id} not found.");
            }

            await _seasonService.EnsureSeasonOpenAsync(
                pressingOperation.SeasonId,
                cancellationToken);

            // Une pression ne se clôture qu'avec sa configuration renseignée.
            var parameters = await _parametersRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            if (parameters is null || !parameters.HasAnyValue())
            {
                throw new BusinessException(
                    "La configuration de pression est obligatoire avant de clôturer la pression.");
            }

            if (pressingOperation.Status != ProductionStatus.InProgress)
            {
                throw new BusinessException(
                    "Seule une pression en cours peut être clôturée.");
            }

            var inputs = await _inputsRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            // Garde-fou : aucun lot ne doit attendre son analyse.
            await _oliveLotService.EnsureLotsAnalysedAsync(
                inputs.Select(input => input.LotId),
                cancellationToken);

            // Les lots entièrement pressés sont vidés.
            await _oliveLotService.CompleteAsync(inputs, cancellationToken);

            foreach (var input in inputs)
            {
                input.Status = PressingOperationInputStatus.Consumed;

                await _inputsRepository.UpdateAsync(
                    input,
                    cancellationToken);
            }

            pressingOperation.EndTime = now;
            pressingOperation.OilQuantityLiters = request.OilQuantity;
            pressingOperation.Status = ProductionStatus.Completed;
            pressingOperation.OilYieldDeviationLiters = pressingOperation.ExpectedOilLiters is not null
                ? request.OilQuantity - pressingOperation.ExpectedOilLiters
                : null;

            await _repository.UpdateAsync(
                pressingOperation,
                cancellationToken);

            return Unit.Value;
        }

    }
}
