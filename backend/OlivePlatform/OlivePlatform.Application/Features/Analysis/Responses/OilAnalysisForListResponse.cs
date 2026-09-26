using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OilAnalysisForListResponse
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string? SourceReference { get; set; }
        public DateTime? PlannedDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public ProductionStatus Status { get; set; }
    }
}
