using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IProductionBatchRepository
    : IRepository<PressingOperation>
{
    Task<PressingOperation?> GetByNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNumberAsync(
        string batchNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default);
}