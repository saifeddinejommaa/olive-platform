using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class PlotRepository
    : Repository<Plot>, IPlotRepository
{
    public PlotRepository(
        OlivePlatformAppDbContext context)
        : base(context)
    {
    }

    public async Task<Plot?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(
                x => x.Code == code,
                cancellationToken);
    }

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(
            x =>
                x.Code == code &&
                (!excludeId.HasValue || x.Id != excludeId.Value),
            cancellationToken);
    }
}