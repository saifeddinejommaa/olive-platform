using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOlivePurchaseItemRepository
    : IRepository<OlivePurchaseItem>
{
    Task<IReadOnlyList<OlivePurchaseItem>> GetByPurchaseIdAsync(
        int purchaseId,
        CancellationToken cancellationToken = default);
}