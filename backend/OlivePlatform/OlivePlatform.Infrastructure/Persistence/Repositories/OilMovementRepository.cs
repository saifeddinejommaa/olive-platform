using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class OilMovementRepository : Repository<OilMovement>, IOilMovementRepository
    {
        public OilMovementRepository(OlivePlatformAppDbContext context)
            : base(context)
        {
        }

        public async Task<IReadOnlyList<OilMovement>> GetByTankIdAsync(
            int tankId,
            CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Where(movement => movement.SourceTankId == tankId
                    || movement.DestinationTankId == tankId)
                .OrderBy(movement => movement.MovementDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<OilBatchBalance>> GetBatchBalancesAsync(
            IEnumerable<int> oilBatchIds,
            CancellationToken cancellationToken = default)
        {
            var ids = oilBatchIds.ToList();

            var movements = await DbSet
                .Where(movement => movement.OilBatchId != null
                    && ids.Contains(movement.OilBatchId.Value))
                .ToListAsync(cancellationToken);

            // + à la citerne de destination, - à la citerne d'origine.
            return movements
                .SelectMany(movement => new[]
                {
                    (TankId: movement.DestinationTankId, Quantity: movement.QuantityLiters, movement.OilBatchId),
                    (TankId: movement.SourceTankId, Quantity: -movement.QuantityLiters, movement.OilBatchId),
                })
                .Where(flow => flow.TankId != null)
                .GroupBy(flow => (TankId: flow.TankId!.Value, OilBatchId: flow.OilBatchId!.Value))
                .Select(group => new OilBatchBalance(
                    group.Key.TankId,
                    group.Key.OilBatchId,
                    group.Sum(flow => flow.Quantity)))
                .Where(balance => balance.QuantityLiters > 0)
                .ToList();
        }

        public async Task<IReadOnlyList<OilBatchBalance>> GetTankBalancesAsync(
            int tankId,
            CancellationToken cancellationToken = default)
        {
            var batchIds = await DbSet
                .Where(movement => movement.OilBatchId != null
                    && (movement.SourceTankId == tankId || movement.DestinationTankId == tankId))
                .Select(movement => movement.OilBatchId!.Value)
                .Distinct()
                .ToListAsync(cancellationToken);

            var balances = await GetBatchBalancesAsync(batchIds, cancellationToken);

            return balances
                .Where(balance => balance.TankId == tankId)
                .OrderBy(balance => balance.OilBatchId)
                .ToList();
        }

        public async Task<IReadOnlyList<OilMovement>> GetByOilBatchIdAsync(
            int oilBatchId,
            CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Where(movement => movement.OilBatchId == oilBatchId)
                .OrderBy(movement => movement.MovementDate)
                .ToListAsync(cancellationToken);
        }
    }
}
