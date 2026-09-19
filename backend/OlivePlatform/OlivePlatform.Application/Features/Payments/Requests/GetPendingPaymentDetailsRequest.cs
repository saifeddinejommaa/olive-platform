using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Payments.Requests
{
    public class GetPendingPaymentDetailsRequest { 
        public CostLineType SourceType { get; set; } 
        public int[] SourceIds { get; set; } = []; 
    }
}
