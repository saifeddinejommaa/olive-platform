using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilBatches.Requests;
using OlivePlatform.Application.Features.OilBatches.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOilBatchQueryRepository
{
    Task<PagedResult<OilBatchForListResponse>> GetOilBatches(
        OilBatchesRequestFilter filter);

    Task<OilBatch?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OilBatch>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<OilBatch?> GetByBatchNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default);
}