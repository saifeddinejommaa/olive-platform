using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Payments.Responses
{
    public class PendingPaymentDetailsResponse
    {
        public CostLineType Type { get; set; }

        public List<PendingPaymentCostLineDetailResponse>? Details { get; set; }
    }
}
