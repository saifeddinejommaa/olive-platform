using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OlivePurchases.Requests;
using OlivePlatform.Application.Features.OlivePurchases.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOlivePurchaseQueryRepository
{
    Task<PagedResult<OlivePurchaseForListResponse>> GetOlivePurchases(
        OlivePurchasesRequestFilter filter);

    Task<List<OlivePurchaseItemDetailsResponse>> GetOlivePurchaseItems(int purchaseId);

    Task<OlivePurchaseDetailsResponse?> GetOlivePurchaseDetails(
        int id);

    Task<OlivePurchase?> GetByPurchaseNumberAsync(
        string purchaseNumber,
        CancellationToken cancellationToken = default);
}