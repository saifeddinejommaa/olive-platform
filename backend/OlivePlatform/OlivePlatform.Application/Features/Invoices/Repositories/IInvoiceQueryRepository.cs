using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Invoices.Requests;
using OlivePlatform.Application.Features.Invoices.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IInvoiceQueryRepository
{
    Task<PagedResult<InvoiceForListResponse>> GetInvoices(
        InvoicesRequestFilter filter);

    Task<InvoiceForDetailsResponse?> GetInvoiceById(
        int id);

    Task<Invoice?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Invoice>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Invoice?> GetByInvoiceNumberAsync(
        string invoiceNumber,
        string invoiceType,
        CancellationToken cancellationToken = default);
}