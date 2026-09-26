using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class ClosePressingOperationCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public int OilQuantity { get; set; }
    }

    public class ClosePressingOperationCommandHandler
    : IRequestHandler<ClosePressingOperationCommand, Unit>
    {

        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;
        private readonly ISeasonService _seasonService;

        public ClosePressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository,
            ISeasonService seasonService)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
            _seasonService = seasonService;
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

            var inputs = await _inputsRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

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
