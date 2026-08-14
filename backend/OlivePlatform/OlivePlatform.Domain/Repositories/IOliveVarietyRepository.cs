using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOliveVarietyRepository
    : IRepository<OliveVariety>
{
    Task<OliveVariety?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNameAsync(
        string name,
        int? excludeId = null,
        CancellationToken cancellationToken = default);
}