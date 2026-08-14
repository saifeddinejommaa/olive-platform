using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IProductionBatchInputQueryRepository
{

    Task<ProductionBatchInput?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductionBatchInput>> GetByProductionBatchIdAsync(
        int productionBatchId,
        CancellationToken cancellationToken = default);
}