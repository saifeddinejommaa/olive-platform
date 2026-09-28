using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories;

public class PressingParametersRepository : IPressingParametersRepository
{
    private readonly OlivePlatformAppDbContext _context;

    public PressingParametersRepository(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task<PressingParameters?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.PressingParameters
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<PressingParameters?> GetByPressingOperationIdAsync(
        int pressingOperationId,
        CancellationToken cancellationToken)
    {
        return await _context.PressingParameters
            .FirstOrDefaultAsync(
                x => x.PressingOperationId == pressingOperationId,
                cancellationToken);
    }

    public async Task AddAsync(
        PressingParameters entity,
        CancellationToken cancellationToken = default)
    {
        await _context.PressingParameters.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(
        PressingParameters entity,
        CancellationToken cancellationToken = default)
    {
        _context.PressingParameters.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public void Delete(PressingParameters entity)
    {
        _context.PressingParameters.Remove(entity);
    }
}
