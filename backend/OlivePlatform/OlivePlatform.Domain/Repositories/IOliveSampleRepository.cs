using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOliveSampleRepository
    : IRepository<OliveSample>
{
    Task<OliveSample?> GetByNumberAsync(
        string sampleNumber,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OliveSample>> GetByPurchaseIdAsync(
        int purchaseId,
        CancellationToken cancellationToken = default);
}