using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OliveLots.Responses;

public class OliveLotResponse
{
    public long Id { get; set; }

    public string Reference { get; set; } = string.Empty;

    public InputSourceType SourceType { get; set; }

    public int? HarvestId { get; set; }

    public int? PurchaseId { get; set; }

    // Référence de la récolte ou de l'achat d'origine.
    public string? SourceReference { get; set; }

    public int? VarietyId { get; set; }

    public decimal QuantityKg { get; set; }

    public decimal RemainingKg { get; set; }

    public decimal? PricePerKg { get; set; }

    public OliveLotStatus Status { get; set; }

    public bool NeedAnalysis { get; set; }

    public int? OliveAnalysisId { get; set; }

    public string? OliveAnalysisReference { get; set; }

    public ProductionStatus? AnalysisStatus { get; set; }

    public decimal? OilPercentage { get; set; }

    // Analyse terminée.
    public bool IsAnalyzed { get; set; }

    // Analyse requise mais pas encore terminée : le lot ne peut pas être pressé.
    public bool ToAnalysis { get; set; }

    public bool IsPressable { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
