using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class PlotVarietyRepository : IPlotVarietyRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public PlotVarietyRepository(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<PlotVariety>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default)
    {
        return await _context.PlotVarieties
            .AsNoTracking()
            .Where(x => x.PlotId == plotId)
            .Include(x => x.VarietyId)
            .ToListAsync(cancellationToken);
    }

    public async Task<PlotVariety?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.PlotVarieties
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task AddAsync(
        PlotVariety entity,
        CancellationToken cancellationToken = default)
    {
        await _context.PlotVarieties.AddAsync(
            entity,
            cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(
        PlotVariety entity,
        CancellationToken cancellationToken = default)
    {
        _context.PlotVarieties.Update(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default)
    {
        var plotVarieties = await _context.PlotVarieties
            .Where(x => x.PlotId == plotId)
            .ToListAsync(cancellationToken);

        if (plotVarieties.Count == 0)
            return;

        _context.PlotVarieties.RemoveRange(plotVarieties);

        await _context.SaveChangesAsync(cancellationToken);
    }
}