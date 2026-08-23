using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class CancelPressingOperationCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class CancelPressingOperationCommandHandler
    : IRequestHandler<CancelPressingOperationCommand, bool>
    {
        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;

        public CancelPressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
        }

        public async Task<bool> Handle(
           CancelPressingOperationCommand request,
           CancellationToken cancellationToken)
        {
            var pressingOperation = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (pressingOperation is null)
                return false;

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

            return true;
        }
    }
}