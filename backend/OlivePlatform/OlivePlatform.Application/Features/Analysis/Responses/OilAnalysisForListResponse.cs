using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OilAnalysisForListResponse
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string? SourceReference { get; set; }
        public DateTime? AnalysisDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public ProductionStatus Status { get; set; }
    }
}
