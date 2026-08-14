using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IInvoiceRepository
    : IRepository<Invoice>
{
    Task<Invoice?> GetByNumberAsync(
        string invoiceNumber,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNumberAsync(
        string invoiceNumber,
        int? excludeId = null,
        CancellationToken cancellationToken = default);
}