using OlivePlatform.Application.Features.Analysis.Responses;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses
{
    public class OlivePurchaseItemDetailsResponse
    {
        public int Id { get; set; }

        public required string Reference { get; set; }

        public int? VarietyId { get; set; }

        public decimal AgreedQuantityKg { get; set; }

        public decimal RemainingQuantityKg { get; set; }

        public decimal PricePerKg { get; set; }

        public int TotalAmount { get; set; }

        public OliveAnalysisInfoResponse? Analysis { get; set; }
    }
}
