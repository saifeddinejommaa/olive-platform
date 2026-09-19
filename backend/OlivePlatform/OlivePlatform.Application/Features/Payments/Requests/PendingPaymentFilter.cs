using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Payments.Requests
{
    public class PendingPaymentFilter : PaginationRequest
    {
        public string? RecipientName { get; set; }
        public CostLineType? CostType { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
    }
}
