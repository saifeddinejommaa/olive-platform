using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Payments.Requests;
using OlivePlatform.Application.Features.Payments.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IPaymentQueryRepository
{
    Task<PagedResult<PaymentForListResponse>> GetPayments(
        PaymentsRequestFilter filter);

    Task<Payment?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Payment>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Payment>> GetByInvoiceIdAsync(
        int invoiceId,
        CancellationToken cancellationToken = default);
}