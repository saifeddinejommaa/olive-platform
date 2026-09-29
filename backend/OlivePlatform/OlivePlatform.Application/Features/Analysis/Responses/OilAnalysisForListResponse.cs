using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OilAnalysisForListResponse
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }
        public string Reference { get; set; } = string.Empty;
        public OilAnalysisSourceType SourceTypeId { get; set; }
        public string? SourceReference { get; set; }

        // Citernes contenant l'huile analysée (« code · nom », séparées par des virgules).
        public string? OilLocation { get; set; }
        public DateTime? PlannedDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public ProductionStatus Status { get; set; }
    }
}
