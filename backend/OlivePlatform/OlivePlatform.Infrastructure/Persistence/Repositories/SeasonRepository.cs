using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class SeasonRepository : ISeasonRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public SeasonRepository(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task<Season?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Seasons
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task<Season?> GetByDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        return await _context.Seasons
            .FirstOrDefaultAsync(
                x => x.StartDate <= date && x.EndDate >= date,
                cancellationToken);
    }

    public async Task AddAsync(
        Season entity,
        CancellationToken cancellationToken = default)
    {
        await _context.Seasons.AddAsync(entity, cancellationToken);
    }

    public Task UpdateAsync(
        Season entity,
        CancellationToken cancellationToken = default)
    {
        _context.Seasons.Update(entity);

        return Task.CompletedTask;
    }
}
