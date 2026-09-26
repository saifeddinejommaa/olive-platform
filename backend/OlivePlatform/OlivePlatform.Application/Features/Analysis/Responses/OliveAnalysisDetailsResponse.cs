using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OliveAnalysisDetailsResponse
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }

        public required string Reference { get; set; }

        public int SourceTypeId { get; set; }

        public int VarietyId { get; set; }

        public required string SourceReference { get; set; }

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
