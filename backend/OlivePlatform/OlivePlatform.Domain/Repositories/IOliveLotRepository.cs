using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.Repositories;

public interface IOliveLotRepository
{
    // Ajout suivi par le contexte : enregistré au prochain SaveChanges.
    Task AddAsync(
        OliveLot lot,
        CancellationToken cancellationToken = default);

    Task<OliveLot?> GetByIdAsync(
        long id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OliveLot>> GetByIdsAsync(
        IEnumerable<long> ids,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OliveLot>> GetByHarvestIdAsync(
        int harvestId,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
