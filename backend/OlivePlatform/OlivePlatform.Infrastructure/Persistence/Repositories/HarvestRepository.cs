using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class HarvestRepository : IHarvestRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public HarvestRepository(
        OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Harvest>>
        GetByPlotIdAsync(
            int plotId,
            CancellationToken cancellationToken = default)
    {
        return await _context.Harvests
            .Where(x => x.PlotId == plotId)
            .OrderByDescending(x => x.HarvestDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Harvest?> GetByNumberAsync(
        string harvestNumber,
        CancellationToken cancellationToken = default)
    {
        return await _context.Harvests
            .FirstOrDefaultAsync(
                x => x.Reference == harvestNumber,
                cancellationToken);
    }

    public async Task AddAsync(Harvest entity, CancellationToken cancellationToken = default)
    {
        await _context.Harvests.AddAsync(
         entity,
         cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNumberAsync(
        string harvestNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await _context.Harvests.AnyAsync(
            x =>
                x.Reference == harvestNumber &&
                (!excludeId.HasValue || x.Id != excludeId.Value),
            cancellationToken);
    }

    public async Task UpdateAsync(Harvest entity, CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Harvest?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Harvests
           .FirstOrDefaultAsync(
               x => x.Id == id,
               cancellationToken);
    }
}