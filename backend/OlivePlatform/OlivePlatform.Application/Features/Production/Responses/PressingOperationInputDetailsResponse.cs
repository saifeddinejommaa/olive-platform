using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Production.Responses
{
    public class PressingOperationInputDetailsResponse
    {
        public int Id { get; set; }

        public InputSourceType SourceType { get; set; }

        public int SourceId { get; set; }

        public string SourceReference { get; set; }

        public decimal QuantityKg { get; set; }

        public decimal PressedQuantityKg { get; set; }

        public required int OliveVarietyId { get; set; }

        public OliveAnalysisInfoResponse? Analysis { get; set; }
    }
}
