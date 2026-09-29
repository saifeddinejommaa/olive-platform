using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOilBatchRepository
    : IRepository<OilBatch>
{
    Task<OilBatch?> GetByNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default);

    // Lots d'huile produits par une pression.
    Task<IReadOnlyList<OilBatch>> GetByPressingOperationIdAsync(
        int pressingOperationId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNumberAsync(
        string batchNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default);
}