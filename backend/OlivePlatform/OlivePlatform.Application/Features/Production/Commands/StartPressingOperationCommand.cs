using MediatR;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class StartPressingOperationCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class StartPressingOperationCommandHandler
        : IRequestHandler<StartPressingOperationCommand, Unit>
    {
        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;
        private readonly ISeasonService _seasonService;
        private readonly IOliveLotService _oliveLotService;

        public StartPressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository,
            ISeasonService seasonService,
            IOliveLotService oliveLotService)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
            _seasonService = seasonService;
            _oliveLotService = oliveLotService;
        }

        public async Task<Unit> Handle(
            StartPressingOperationCommand request,
            CancellationToken cancellationToken)
        {
            var pressingOperation = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (pressingOperation is null)
            {
                throw new KeyNotFoundException(
                    $"Pressing operation {request.Id} not found.");
            }

            if (pressingOperation.Status != ProductionStatus.Planned)
            {
                throw new BusinessException(
                    "Seule une pression planifiée peut être lancée.");
            }

            await _seasonService.EnsureSeasonOpenAsync(
                pressingOperation.SeasonId,
                cancellationToken);

            var inputs = await _inputsRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            // Un lot dont l'analyse est requise mais non terminée bloque le lancement.
            await _oliveLotService.EnsureLotsAnalysedAsync(
                inputs.Select(input => input.LotId),
                cancellationToken);

            var now = DateTime.UtcNow;

            foreach (var input in inputs)
            {
                if (input.Status == PressingOperationInputStatus.Reserved)
                {
                    input.Status = PressingOperationInputStatus.Consumed;

                    await _inputsRepository.UpdateAsync(
                        input,
                        cancellationToken);
                }
            }

            pressingOperation.StartTime = now;
            pressingOperation.Status = ProductionStatus.InProgress;

            await _repository.UpdateAsync(
                pressingOperation,
                cancellationToken);

            return Unit.Value;
        }
    }
}