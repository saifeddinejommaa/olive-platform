using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OliveSamples.Requests;
using OlivePlatform.Application.Features.OliveSamples.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOliveSampleQueryRepository
{
    Task<PagedResult<OliveSampleForListResponse>> GetOliveSamples(
        OliveSamplesRequestFilter filter);

    Task<OliveSample?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OliveSample>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OliveSample>> GetByPurchaseIdAsync(
        int purchaseId,
        CancellationToken cancellationToken = default);
}