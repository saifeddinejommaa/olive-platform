using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{

    public class PressingOperationInputsRepository : IPressingOperationInputsRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public PressingOperationInputsRepository(OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PressingOperationInput entity, CancellationToken cancellationToken = default)
        {
            await _context.PressingOperationInputs.AddAsync(
             entity,
             cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByPressingOperationIdAsync(int pressingOperationId, CancellationToken cancellationToken = default)
        {
            var entities = await _context.PressingOperationInputs
             .Where(x => x.PressingOperationId == pressingOperationId)
             .ToListAsync(cancellationToken);

            if (entities.Count == 0)
                return;

            _context.PressingOperationInputs.RemoveRange(entities);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<PressingOperationInput?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.PressingOperationInputs
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);
        }

        public async Task<IReadOnlyList<PressingOperationInput>> GetByPressingOperationIdAsync(int pressingOperationId, CancellationToken cancellationToken = default)
        {
            return await _context.PressingOperationInputs
                .Where(x => x.PressingOperationId == pressingOperationId)
                .ToListAsync(cancellationToken);
        }

        public async Task UpdateAsync(PressingOperationInput entity, CancellationToken cancellationToken = default)
        {
            _context.PressingOperationInputs.Update(entity);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
