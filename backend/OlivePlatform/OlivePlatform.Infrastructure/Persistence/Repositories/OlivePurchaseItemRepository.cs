using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class OlivePurchaseItemRepository
    : IOlivePurchaseItemRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public OlivePurchaseItemRepository(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(OlivePurchaseItem entity, CancellationToken cancellationToken = default)
    {
        await _context.OlivePurchaseItems.AddAsync(entity, cancellationToken);
    }

    public async Task<OlivePurchaseItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.OlivePurchaseItems
         .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<OlivePurchaseItem>> GetByPurchaseIdAsync(int purchaseId, CancellationToken cancellationToken = default)
    {
        return await _context.OlivePurchaseItems
         .Where(x => x.PurchaseId == purchaseId)
         .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(OlivePurchaseItem entity, CancellationToken cancellationToken = default)
    {
        _context.OlivePurchaseItems.Update(entity);
        await _context.SaveChangesAsync(
         cancellationToken);
    }
}