using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class OlivePurchaseRepository
    : IOlivePurchaseRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public OlivePurchaseRepository(
        OlivePlatformAppDbContext context)
        
    {
        _context = context;
    }

    public async Task AddAsync(OlivePurchase entity, CancellationToken cancellationToken = default)
    {
        await _context.OlivePurchases.AddAsync(entity, cancellationToken);
    }

    public async Task<OlivePurchase?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.OlivePurchases
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task UpdateAsync(OlivePurchase entity, CancellationToken cancellationToken = default)
    {
        _context.OlivePurchases.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}