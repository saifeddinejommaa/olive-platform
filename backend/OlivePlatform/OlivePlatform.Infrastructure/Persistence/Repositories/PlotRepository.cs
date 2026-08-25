using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class PlotRepository : IPlotRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public PlotRepository(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        Plot entity,
        CancellationToken cancellationToken = default)
    {
        await _context.Plots.AddAsync(
            entity,
            cancellationToken);

        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public async Task<Plot?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Plots
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task UpdateAsync(
        Plot entity,
        CancellationToken cancellationToken = default)
    {
        _context.Plots.Update(entity);

        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public async Task<bool> ExistsByReferenceAsync(
        string reference,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await _context.Plots.AnyAsync(
            x =>
                x.Reference == reference &&
                (!excludeId.HasValue || x.Id != excludeId.Value),
            cancellationToken);
    }

    public async Task<Plot?> GetByReferenceAsync(string refernce, CancellationToken cancellationToken = default)
    {
        return await _context.Plots
           .FirstOrDefaultAsync(
               x => x.Reference == refernce,
               cancellationToken);
    }

    public async Task<int> GetAvailableTreesAsync(
    int plotId,
    int varietyId,
    DateOnly harvestDate,
    CancellationToken cancellationToken)
    {
        var plotVariety = await _context.PlotVarieties
        .AsNoTracking()
        .Where(x =>
            x.PlotId == plotId &&
            x.VarietyId == varietyId)
        .Select(x => new
        {
            x.PlotId,
            x.VarietyId,
            x.NumberOfTrees
        })
        .FirstOrDefaultAsync(cancellationToken);

        if (plotVariety == null)
        {
            throw new KeyNotFoundException(
                $"La variété {varietyId} n'est pas associée à la parcelle {plotId}.");
        }

        var startDate = new DateOnly(harvestDate.Year, 1, 1);

        var harvestedTrees = await _context.Harvests
            .AsNoTracking()
            .Where(x =>
                x.PlotId == plotId &&
                x.VarietyId == varietyId &&
                x.HarvestDate >= startDate &&
                x.HarvestDate <= harvestDate)
            .SumAsync(
                x => (int?)x.HarvestedTrees,
                cancellationToken) ?? 0;

        var plannedTrees = await _context.Harvests
            .AsNoTracking()
            .Where(x =>
                x.PlotId == plotId &&
                x.VarietyId == varietyId &&
                x.HarvestDate >= startDate &&
                x.HarvestDate <= harvestDate)
            .SumAsync(
                x => x.PlannedTrees,
                cancellationToken) ?? 0;

        return Math.Max(
            0,
            plotVariety.NumberOfTrees - harvestedTrees - plannedTrees);
    }
}