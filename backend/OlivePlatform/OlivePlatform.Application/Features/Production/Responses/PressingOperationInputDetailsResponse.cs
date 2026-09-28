using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Production.Responses
{
    public class PressingOperationInputDetailsResponse
    {
        public int Id { get; set; }

        // Lot d'olives pressé.
        public long LotId { get; set; }

        public string LotReference { get; set; } = string.Empty;

        public InputSourceType SourceType { get; set; }

        // Récolte ou achat d'origine du lot.
        public int SourceId { get; set; }

        public string SourceReference { get; set; } = string.Empty;

        // Quantité totale du lot.
        public decimal QuantityKg { get; set; }

        public decimal RemainingKg { get; set; }

        public decimal PressedQuantityKg { get; set; }

        public int? OliveVarietyId { get; set; }

        public OliveAnalysisInfoResponse? Analysis { get; set; }
    }
}
