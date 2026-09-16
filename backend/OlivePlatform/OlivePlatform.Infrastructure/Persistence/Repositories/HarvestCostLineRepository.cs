using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class HarvestCostLineRepository : IHarvestCostLineRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public HarvestCostLineRepository(
       OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(HarvestCostLine entity, CancellationToken cancellationToken = default)
        {
            await _context.HarvestCostLine.AddAsync(
                            entity,
                            cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<HarvestCostLine?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.HarvestCostLine
                            .FirstOrDefaultAsync(
                                x => x.Id == id,
                                cancellationToken);
        }

        public async Task UpdateAsync(HarvestCostLine entity, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
