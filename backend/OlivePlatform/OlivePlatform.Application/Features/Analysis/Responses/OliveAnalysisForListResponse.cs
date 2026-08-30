

using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OliveAnalysisForListResponse
    {
        public int Id { get; set; }

        public int Total { get; set; }

        public required string Reference { get; set; }

        public required string SourceReference { get; set; }

        public required string PlotReference { get; set; }

        public DateTime? AnalysisDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public ProductionStatus Status { get; set; }
    }
}
