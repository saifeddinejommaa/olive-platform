using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class OlivePurchaseItemRepository
    : Repository<OlivePurchaseItem>, IOlivePurchaseItemRepository
{
    public OlivePurchaseItemRepository(OlivePlatformAppDbContext context)
        : base(context)
    {
    }

    public Task DeleteByPurchaseIdAsync(int purchaseId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<OlivePurchaseItem>> GetByPurchaseIdAsync(int purchaseId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}