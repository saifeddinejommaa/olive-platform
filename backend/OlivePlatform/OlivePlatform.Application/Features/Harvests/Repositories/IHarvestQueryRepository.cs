using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IHarvestQueryRepository
{
    Task<PagedResult<HarvestForListResponse>> GetHarvests(
        HarvestsRequestFilter filter);

    Task<Harvest?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Harvest>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);
}