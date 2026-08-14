using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class OlivePurchaseRepository
    : Repository<OlivePurchase>, IOlivePurchaseRepository
{
    public OlivePurchaseRepository(
        OlivePlatformAppDbContext context)
        : base(context)
    {
    }

    public async Task<OlivePurchase?> GetByNumberAsync(
        string purchaseNumber,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(
                x => x.PurchaseNumber == purchaseNumber,
                cancellationToken);
    }

    public async Task<bool> ExistsByNumberAsync(
        string purchaseNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(
            x =>
                x.PurchaseNumber == purchaseNumber &&
                (!excludeId.HasValue || x.Id != excludeId.Value),
            cancellationToken);
    }

    public async Task<IReadOnlyList<OlivePurchase>>
        GetBySupplierAsync(
            string supplierName,
            CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(x => x.SupplierName == supplierName)
            .OrderByDescending(x => x.PurchaseDate)
            .ToListAsync(cancellationToken);
    }
}