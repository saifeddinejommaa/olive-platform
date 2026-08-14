using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IProductionBatchInputRepository
    : IRepository<PressingOperationInput>
{
    Task<IReadOnlyList<PressingOperationInput>>
        GetByProductionBatchIdAsync(
            int productionBatchId,
            CancellationToken cancellationToken = default);

    Task DeleteByProductionBatchIdAsync(
        int productionBatchId,
        CancellationToken cancellationToken = default);
}