using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOilMovementRepository
    : IRepository<OilMovement>
{
    Task<IReadOnlyList<OilMovement>> GetByTankIdAsync(
        int tankId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OilMovement>> GetByOilBatchIdAsync(
        int oilBatchId,
        CancellationToken cancellationToken = default);
}