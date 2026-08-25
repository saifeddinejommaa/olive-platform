using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPressingOperationInputsRepository
    : IRepository<PressingOperationInput>
{

    Task<IReadOnlyList<PressingOperationInput>>
        GetByPressingOperationIdAsync(
            int pressingOperationId,
            CancellationToken cancellationToken = default);

    Task DeleteByPressingOperationIdAsync(
        int pressingOperationId,
        CancellationToken cancellationToken = default);
}