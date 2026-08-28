using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IHarvestQueryRepository
{
    Task<PagedResult<HarvestForListResponse>> GetHarvests(
        HarvestsRequestFilter filter);

    Task<PagedResult<HarvestStockForListResponse>> GetHarvestStocks(int id,
        HarvestStocksRequestFilter filter,
        CancellationToken cancellationToken = default);

    Task<HarvestDetailsResponse?> GetHarvestDetails(
    int id,
    CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Harvest>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);
}