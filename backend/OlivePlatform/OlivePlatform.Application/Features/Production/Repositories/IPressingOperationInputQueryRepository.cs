using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IPressingOperationInputQueryRepository
{

    Task<PressingOperationInput?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PressingOperationInput>> GetByProductionBatchIdAsync(
        int productionBatchId,
        CancellationToken cancellationToken = default);
}