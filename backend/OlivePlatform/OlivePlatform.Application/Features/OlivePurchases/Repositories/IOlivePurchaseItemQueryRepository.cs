using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOlivePurchaseItemQueryRepository
{
    

    Task<OlivePurchaseItem?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OlivePurchaseItem>> GetByPurchaseIdAsync(
        int purchaseId,
        CancellationToken cancellationToken = default);
}