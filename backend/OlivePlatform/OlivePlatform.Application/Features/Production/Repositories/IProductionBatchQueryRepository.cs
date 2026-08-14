using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Production.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IProductionBatchQueryRepository
{
    Task<PagedResult<ProductionBatchForListResponse>> GetProductionBatches(
        ProductionBatchesRequestFilter filter);

    Task<ProductionBatch?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductionBatch>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<ProductionBatch?> GetByBatchNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default);
}