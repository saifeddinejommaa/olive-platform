using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IHarvestRepository
    : IRepository<Harvest>
{
    Task<IReadOnlyList<Harvest>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);

    Task<Harvest?> GetByNumberAsync(
        string harvestNumber,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNumberAsync(
        string harvestNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default);
}