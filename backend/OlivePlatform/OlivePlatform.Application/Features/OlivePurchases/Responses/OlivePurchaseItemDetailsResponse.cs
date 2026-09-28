using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses
{
    // Ligne d'achat = un lot d'olives (olive_lots) rattaché à l'achat.
    public class OlivePurchaseItemDetailsResponse
    {
        public long Id { get; set; }

        public required string Reference { get; set; }

        public int? VarietyId { get; set; }

        public decimal AgreedQuantityKg { get; set; }

        public decimal RemainingQuantityKg { get; set; }

        public OliveLotStatus Status { get; set; }

        public bool NeedAnalysis { get; set; }

        // Analyse terminée.
        public bool IsAnalyzed { get; set; }

        // Analyse requise mais non terminée : le lot ne peut pas être pressé.
        public bool ToAnalysis { get; set; }

        public bool IsPressable { get; set; }

        public decimal PricePerKg { get; set; }

        public decimal TotalAmount { get; set; }

        public OliveAnalysisInfoResponse? Analysis { get; set; }
    }
}
