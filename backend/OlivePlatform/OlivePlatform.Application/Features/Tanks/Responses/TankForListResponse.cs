using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Tanks.Responses;

public class TankForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal CapacityLiters { get; set; }

    public decimal CurrentQuantityLiters { get; set; }

    public decimal AvailableCapacityLiters { get; set; }

    public decimal FillPercentage { get; set; }

    public TankType TankType { get; set; }

    public string TankTypeLabel { get; set; } = string.Empty;

    public OilCategory OilCategory { get; set; }

    public string OilCategoryLabel { get; set; } = string.Empty;

    public string Status { get; set; } = null!;

    // Tampon occupée : pression dont l'huile attend son analyse.
    public string? PendingPressingNumber { get; set; }

    // Analyse d'huile de cette pression : planifiée, en cours ou terminée.
    public int? PendingOilAnalysisId { get; set; }

    public ProductionStatus? PendingOilAnalysisStatus { get; set; }

    public decimal? PendingAcidityPercentage { get; set; }

    public decimal? PendingPeroxideIndex { get; set; }

    public decimal? PendingK232 { get; set; }

    public decimal? PendingK270 { get; set; }
}
