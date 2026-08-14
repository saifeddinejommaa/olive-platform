using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IInvoiceItemQueryRepository
{

    Task<InvoiceItem?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<InvoiceItem>> GetByInvoiceIdAsync(
        int invoiceId,
        CancellationToken cancellationToken = default);
}