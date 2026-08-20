using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPressionOperationsRepository
    : IRepository<PressingOperation>
{
    Task AddInputsAsync(
       IEnumerable<PressingOperationInput> inputs,
       CancellationToken cancellationToken);
}