using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OilAnalysisDetailsResponse
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }
        public string Reference { get; set; } = string.Empty;
        public OilAnalysisSourceType SourceTypeId { get; set; }
        public int SourceId { get; set; }
        public string SourceReference { get; set; } = string.Empty;
        public decimal? AcidityPercentage { get; set; }
        public decimal? PeroxideIndex { get; set; }
        public decimal? K232 { get; set; }
        public decimal? K270 { get; set; }
        public int? OrganolepticGrade { get; set; }
        public DateTime? PlannedDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ProductionStatus Status { get; set; }

        // Huile produite par la pression source (L).
        public decimal? OilQuantityLiters { get; set; }

        // Où se trouve l'huile analysée aujourd'hui.
        public List<OilLocationResponse> OilLocations { get; set; } = [];
    }

    // Citerne contenant une partie de l'huile analysée.
    public class OilLocationResponse
    {
        public int TankId { get; set; }

        public string TankCode { get; set; } = null!;

        public string? TankName { get; set; }

        public TankType TankType { get; set; }

        public string TankTypeLabel { get; set; } = string.Empty;

        public string OilCategoryLabel { get; set; } = string.Empty;

        public decimal QuantityLiters { get; set; }

        public decimal CapacityLiters { get; set; }

        public string? BatchNumbers { get; set; }
    }
}
