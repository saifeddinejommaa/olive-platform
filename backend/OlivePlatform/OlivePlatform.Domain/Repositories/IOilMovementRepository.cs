using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOilMovementRepository
    : IRepository<OilMovement>
{
    Task<IReadOnlyList<OilMovement>> GetByTankIdAsync(
        int tankId,
        CancellationToken cancellationToken = default);

    // Quantité restante de chaque lot, par citerne (entrées moins sorties, > 0).
    Task<IReadOnlyList<OilBatchBalance>> GetBatchBalancesAsync(
        IEnumerable<int> oilBatchIds,
        CancellationToken cancellationToken = default);

    // Lots présents dans une citerne, avec leur quantité (> 0).
    Task<IReadOnlyList<OilBatchBalance>> GetTankBalancesAsync(
        int tankId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OilMovement>> GetByOilBatchIdAsync(
        int oilBatchId,
        CancellationToken cancellationToken = default);
}
// Quantité d'un lot d'huile présente dans une citerne.
public record OilBatchBalance(int TankId, int OilBatchId, decimal QuantityLiters);
