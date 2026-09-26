using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface ISeasonRepository : IRepository<Season>
{
    Task<Season?> GetByDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default);
}
