using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IInvoiceItemRepository
    : IRepository<InvoiceItem>
{
    Task<IReadOnlyList<InvoiceItem>> GetByInvoiceIdAsync(
        int invoiceId,
        CancellationToken cancellationToken = default);

    Task DeleteByInvoiceIdAsync(
        int invoiceId,
        CancellationToken cancellationToken = default);
}