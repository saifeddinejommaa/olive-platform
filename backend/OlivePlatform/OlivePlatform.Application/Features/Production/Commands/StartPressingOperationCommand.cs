using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class StartPressingOperationCommand : IRequest<PressingOperation>
    {
        public int Id { get; set; }

        public DateTime StartDate { get; set; }
    }

    public class StartPressingOperationCommandHandler
        : IRequestHandler<StartPressingOperationCommand, PressingOperation>
    {
        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;

        public StartPressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
        }

        public async Task<PressingOperation> Handle(
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

            var inputs = await _inputsRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

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

            pressingOperation.StartTime = request.StartDate;
            pressingOperation.Status = ProductionStatus.InProgress;

            await _repository.UpdateAsync(
                pressingOperation,
                cancellationToken);

            return pressingOperation;
        }
    }
}