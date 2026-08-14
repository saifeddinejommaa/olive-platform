using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OlivePurchases.Requests;
using OlivePlatform.Application.Features.OlivePurchases.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOlivePurchaseQueryRepository
{
    Task<PagedResult<OlivePurchaseForListResponse>> GetOlivePurchases(
        OlivePurchasesRequestFilter filter);

    Task<OlivePurchaseForDetailsResponse?> GetOlivePurchaseById(
        int id);

    Task<OlivePurchase?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OlivePurchase>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<OlivePurchase?> GetByPurchaseNumberAsync(
        string purchaseNumber,
        CancellationToken cancellationToken = default);
}