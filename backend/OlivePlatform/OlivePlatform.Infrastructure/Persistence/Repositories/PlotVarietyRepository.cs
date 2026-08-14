using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class PlotVarietyRepository
    : Repository<PlotVariety>, IPlotVarietyRepository
{
    public PlotVarietyRepository(
        OlivePlatformAppDbContext context)
        : base(context)
    {
    }

    public async Task<IReadOnlyList<PlotVariety>>
        GetByPlotIdAsync(
            int plotId,
            CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(x => x.PlotId == plotId)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default)
    {
        await DbSet
            .Where(x => x.PlotId == plotId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}