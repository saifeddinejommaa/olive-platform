

using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OliveAnalysisForListResponse
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }

        public int Total { get; set; }

        public required string Reference { get; set; }

        public required string SourceReference { get; set; }

        public string? PlotReference { get; set; }

        // 1 = récolte, 2 = achat (null si aucun lot rattaché).
        public int? SourceTypeId { get; set; }

        public decimal? HumidityPercentage { get; set; }

        public decimal? WaterPercentage { get; set; }

        public decimal? OilPercentage { get; set; }

        public decimal? AcidityPercentage { get; set; }

        public DateTime? PlannedDate { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public ProductionStatus Status { get; set; }
    }
}
