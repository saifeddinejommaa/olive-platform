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

        // Lots d'olives analysés (pour les retrouver dans le stock).
        public List<OliveAnalysisLotResponse> Lots { get; set; } = [];
    }

    // Lot d'olives rattaché à une analyse.
    public class OliveAnalysisLotResponse
    {
        public long Id { get; set; }

        public string Reference { get; set; } = null!;

        // 1 : récolte, 2 : achat.
        public int SourceTypeId { get; set; }

        public int? HarvestId { get; set; }

        public int? PurchaseId { get; set; }

        public string? SourceReference { get; set; }

        public decimal QuantityKg { get; set; }

        public decimal RemainingKg { get; set; }

        public int Status { get; set; }

        public string? StatusLabel { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
