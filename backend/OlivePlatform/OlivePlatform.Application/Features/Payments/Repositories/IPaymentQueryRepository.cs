using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Payments.Requests;
using OlivePlatform.Application.Features.Payments.Responses;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IPaymentQueryRepository
{
    Task<PagedResult<PendingPaymentResponse>> GetPendingPayments(PendingPaymentFilter filter,
       CancellationToken cancellationToken = default);

    Task<PagedResult<ProcessedPaymentResponse>> GetPaymentHistory(PaymentHistoryFilter filter,
        CancellationToken cancellationToken = default);

    Task<PendingPaymentDetailsResponse> GetPendingPaymentDetails(
    GetPendingPaymentDetailsRequest request,
    CancellationToken cancellationToken = default);
}