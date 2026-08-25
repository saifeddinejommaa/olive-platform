using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class OliveVarietyRepository
    : Repository<OliveVariety>, IOliveVarietyRepository
{
    public OliveVarietyRepository(
        OlivePlatformAppDbContext context)
        : base(context)
    {
    }

    public async Task<OliveVariety?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(
                x => x.Label == name,
                cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(
        string name,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(
            x =>
                x.Label == name &&
                (!excludeId.HasValue || x.Id != excludeId.Value),
            cancellationToken);
    }
}