using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class OilBatchRepository : Repository<OilBatch>, IOilBatchRepository
    {
        public OilBatchRepository(OlivePlatformAppDbContext context)
            : base(context)
        {
        }

        public async Task<OilBatch?> GetByNumberAsync(
            string batchNumber,
            CancellationToken cancellationToken = default)
        {
            return await DbSet.FirstOrDefaultAsync(
                batch => batch.BatchNumber == batchNumber,
                cancellationToken);
        }

        public async Task<IReadOnlyList<OilBatch>> GetByPressingOperationIdAsync(
            int pressingOperationId,
            CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Where(batch => batch.ProductionBatchId == pressingOperationId)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByNumberAsync(
            string batchNumber,
            int? excludeId = null,
            CancellationToken cancellationToken = default)
        {
            return await DbSet.AnyAsync(
                batch => batch.BatchNumber == batchNumber
                    && (excludeId == null || batch.Id != excludeId),
                cancellationToken);
        }
    }
}
