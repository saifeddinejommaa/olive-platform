using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class TankRepository : Repository<Tank>, ITankRepository
    {
        public TankRepository(OlivePlatformAppDbContext context)
            : base(context)
        {
        }

        public async Task<Tank?> GetByCodeAsync(
            string code,
            CancellationToken cancellationToken = default)
        {
            return await DbSet.FirstOrDefaultAsync(
                tank => tank.Code == code,
                cancellationToken);
        }

        public async Task<bool> ExistsByCodeAsync(
            string code,
            int? excludeId = null,
            CancellationToken cancellationToken = default)
        {
            return await DbSet.AnyAsync(
                tank => tank.Code == code
                    && (excludeId == null || tank.Id != excludeId),
                cancellationToken);
        }

        public async Task<decimal> GetCurrentQuantityAsync(
            int tankId,
            CancellationToken cancellationToken = default)
        {
            var incoming = await Context.OilMovements
                .Where(movement => movement.DestinationTankId == tankId)
                .SumAsync(movement => movement.QuantityLiters, cancellationToken);

            var outgoing = await Context.OilMovements
                .Where(movement => movement.SourceTankId == tankId)
                .SumAsync(movement => movement.QuantityLiters, cancellationToken);

            return incoming - outgoing;
        }
    }
}
