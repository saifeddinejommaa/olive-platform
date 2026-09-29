using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilSales.Requests;
using OlivePlatform.Application.Features.OilSales.Responses;

namespace OlivePlatform.Application.Features.OilSales.Repositories;

public interface IOilSaleQueryRepository
{
    Task<PagedResult<OilSaleForListResponse>> GetOilSalesAsync(
        OilSalesRequestFilter filter,
        CancellationToken cancellationToken = default);

    Task<OilSaleDetailsResponse?> GetDetailsAsync(
        int id,
        CancellationToken cancellationToken = default);
}
