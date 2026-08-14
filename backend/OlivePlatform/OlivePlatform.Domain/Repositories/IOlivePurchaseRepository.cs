using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOlivePurchaseRepository
    : IRepository<OlivePurchase>
{
    Task<OlivePurchase?> GetByNumberAsync(
        string purchaseNumber,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNumberAsync(
        string purchaseNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OlivePurchase>> GetBySupplierAsync(
        string supplierName,
        CancellationToken cancellationToken = default);
}