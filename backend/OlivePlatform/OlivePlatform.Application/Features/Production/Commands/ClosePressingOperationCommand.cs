using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class ClosePressingOperationCommand : IRequest<int>
    {
        public int Id { get; set; }

        public DateTime? EndDate { get; set; }

        public int OliveQuantity { get; set; }
    }

    public class ClosePressingOperationCommandHandler
    : IRequestHandler<ClosePressingOperationCommand, int>
    {
        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;

        public ClosePressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
        }

        public async Task<int> Handle(
    ClosePressingOperationCommand request,
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
                input.Status = PressingOperationInputStatus.Consumed;

                await _inputsRepository.UpdateAsync(
                    input,
                    cancellationToken);
            }

            pressingOperation.EndTime = request.EndDate;
            pressingOperation.OilQuantityLiters = request.OliveQuantity;
            pressingOperation.Status = ProductionStatus.Completed;

            await _repository.UpdateAsync(
                pressingOperation,
                cancellationToken);

            return pressingOperation.Id;
        }
    }
}
