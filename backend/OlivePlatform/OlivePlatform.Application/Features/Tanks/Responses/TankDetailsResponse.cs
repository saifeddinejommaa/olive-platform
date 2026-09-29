using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Tanks.Responses;

// Citerne avec son contenu (lots d'huile présents) et ses derniers mouvements.
public class TankDetailsResponse : TankForListResponse
{
    public string? Notes { get; set; }

    public List<TankContentResponse> Contents { get; set; } = [];

    public List<TankMovementResponse> Movements { get; set; } = [];
}

// Lot d'huile présent dans la citerne.
public class TankContentResponse
{
    public int OilBatchId { get; set; }

    public string BatchNumber { get; set; } = null!;

    public DateTime ProductionDate { get; set; }

    public string BatchStatus { get; set; } = null!;

    // Quantité du lot encore dans cette citerne.
    public decimal QuantityLiters { get; set; }

    public int? PressingOperationId { get; set; }

    public string? PressingNumber { get; set; }

    // Analyse d'huile de la pression d'origine (dernière en date).
    public int? OilAnalysisId { get; set; }

    public string? OilAnalysisReference { get; set; }

    public ProductionStatus? OilAnalysisStatus { get; set; }

    public decimal? AcidityPercentage { get; set; }

    public decimal? PeroxideIndex { get; set; }

    public decimal? K232 { get; set; }

    public decimal? K270 { get; set; }
}

// Mouvement d'huile, vu depuis la citerne (entrée ou sortie).
public class TankMovementResponse
{
    public int Id { get; set; }

    public string MovementNumber { get; set; } = null!;

    public DateTime MovementDate { get; set; }

    public OilMovementType MovementType { get; set; }

    public string? MovementTypeLabel { get; set; }

    public bool IsIncoming { get; set; }

    public decimal QuantityLiters { get; set; }

    // Citerne d'origine (entrée) ou de destination (sortie).
    public string? OtherTankCode { get; set; }

    public string? BatchNumber { get; set; }

    public int? PressingOperationId { get; set; }

    public string? PressingNumber { get; set; }
}
