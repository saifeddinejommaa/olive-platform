using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Payments.Requests
{
    public class PaymentsRequestFilter : PaginationRequest
    {
        public string? PaymentNumber { get; set; }

        public int? InvoiceId { get; set; }

        public PaymentMethod? PaymentMethod { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}
