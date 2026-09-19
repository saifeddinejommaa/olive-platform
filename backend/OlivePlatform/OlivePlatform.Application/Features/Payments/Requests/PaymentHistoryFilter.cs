using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Payments.Requests
{
    public class PaymentHistoryFilter : PaginationRequest
    {
        public string? RecipientName { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public DateTime? PaymentDateFrom { get; set; }
        public DateTime? PaymentDateTo { get; set; }
    }
}
