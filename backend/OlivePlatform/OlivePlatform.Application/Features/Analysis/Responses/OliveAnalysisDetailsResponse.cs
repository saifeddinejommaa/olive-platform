using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OliveAnalysisDetailsResponse
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }

        public required string Reference { get; set; }

        // Null si l'analyse n'est rattachée à aucun lot.
        public int? SourceTypeId { get; set; }

        public int? VarietyId { get; set; }

        // Lots analysés : quantité totale et nombre.
        public decimal QuantityKg { get; set; }

        public int LotsCount { get; set; }

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
