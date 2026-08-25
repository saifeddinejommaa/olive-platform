using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class HarvestRepository
    : Repository<Harvest>, IHarvestRepository
{

    private readonly OlivePlatformAppDbContext _context;
    public HarvestRepository(
        OlivePlatformAppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Harvest>>
        GetByPlotIdAsync(
            int plotId,
            CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(x => x.PlotId == plotId)
            .OrderByDescending(x => x.HarvestDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Harvest?> GetByNumberAsync(
        string harvestNumber,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
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
        return await DbSet.AnyAsync(
            x =>
                x.Reference == harvestNumber &&
                (!excludeId.HasValue || x.Id != excludeId.Value),
            cancellationToken);
    }
}