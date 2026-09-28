using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class OliveLotRepository : IOliveLotRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public OliveLotRepository(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        OliveLot lot,
        CancellationToken cancellationToken = default)
    {
        await _context.OliveLots.AddAsync(lot, cancellationToken);
    }

    public async Task<OliveLot?> GetByIdAsync(
        long id,
        CancellationToken cancellationToken = default)
    {
        return await _context.OliveLots
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<OliveLot>> GetByIdsAsync(
        IEnumerable<long> ids,
        CancellationToken cancellationToken = default)
    {
        var idList = ids.Distinct().ToList();

        return await _context.OliveLots
            .Where(x => idList.Contains(x.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<OliveLot>> GetByHarvestIdAsync(
        int harvestId,
        CancellationToken cancellationToken = default)
    {
        return await _context.OliveLots
            .Where(x => x.HarvestId == harvestId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<OliveLot>> GetByPurchaseIdAsync(
        int purchaseId,
        CancellationToken cancellationToken = default)
    {
        return await _context.OliveLots
            .Where(x => x.PurchaseId == purchaseId)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
