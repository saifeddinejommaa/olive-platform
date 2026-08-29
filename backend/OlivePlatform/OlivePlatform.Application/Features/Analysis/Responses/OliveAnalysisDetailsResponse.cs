namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OliveAnalysisDetailsResponse
    {
        public int Id { get; set; }

        public int SourceTypeId { get; set; }

        public int SourceId { get; set; }

        public int PlotId { get; set; }

        public decimal? HumidityPercentage { get; set; }

        public decimal? WaterPercentage { get; set; }

        public decimal? OilPercentage { get; set; }

        public decimal? AcidityPercentage { get; set; }

        public DateTime? AnalysisDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int VarietyId { get; set; }
    }
}
