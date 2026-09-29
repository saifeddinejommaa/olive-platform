using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface ITankRepository : IRepository<Tank>
{
    Task<Tank?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId = null,
        CancellationToken cancellationToken = default);

    // Contenu actuel (L) : entrées moins sorties des mouvements d'huile.
    Task<decimal> GetCurrentQuantityAsync(
        int tankId,
        CancellationToken cancellationToken = default);
}
