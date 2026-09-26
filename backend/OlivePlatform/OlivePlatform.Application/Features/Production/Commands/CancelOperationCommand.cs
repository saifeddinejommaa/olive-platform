using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class CancelPressingOperationCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class CancelPressingOperationCommandHandler
    : IRequestHandler<CancelPressingOperationCommand, Unit>
    {
        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;
        private readonly ISeasonService _seasonService;

        public CancelPressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository,
            ISeasonService seasonService)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
            _seasonService = seasonService;
        }

        public async Task<Unit> Handle(
           CancelPressingOperationCommand request,
           CancellationToken cancellationToken)
        {
            var pressingOperation = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (pressingOperation is null)
                throw new KeyNotFoundException(
                    $"Pressing operation {request.Id} not found.");

            await _seasonService.EnsureSeasonOpenAsync(
                pressingOperation.SeasonId,
                cancellationToken);

            var inputs = await _inputsRepository
                .GetByPressingOperationIdAsync(
                    request.Id,
                    cancellationToken);

            foreach (var input in inputs)
            {
                input.Status = PressingOperationInputStatus.Released;

                await _inputsRepository.UpdateAsync(
                    input,
                    cancellationToken);
            }

            pressingOperation.Status = ProductionStatus.Cancelled;

            await _repository.UpdateAsync(
                pressingOperation,
                cancellationToken);

            return Unit.Value;
        }
    }
}