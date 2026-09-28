using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Lot d'olives pouvant être pressé : issu d'une récolte (un lot par stock
// créé à la clôture) ou d'un achat (un lot par ligne d'achat).
[Table("olive_lots")]
public class OliveLot
{
    [Column("id")]
    public long Id { get; set; }

    [Column("reference")]
    public string Reference { get; set; } = null!;

    [Column("season_id")]
    public int SeasonId { get; set; }

    // Table source_types : 1 = récolte, 2 = achat.
    [Column("source_type_id")]
    public InputSourceType SourceType { get; set; }

    [Column("harvest_id")]
    public int? HarvestId { get; set; }

    [Column("purchase_id")]
    public int? PurchaseId { get; set; }

    [Column("variety_id")]
    public int? VarietyId { get; set; }

    [Column("quantity_kg")]
    public decimal QuantityKg { get; set; }

    // Quantité non encore engagée dans une pression.
    [Column("remaining_kg")]
    public decimal RemainingKg { get; set; }

    // Prix d'achat au kg (lots d'achat uniquement).
    [Column("price_per_kg")]
    public decimal? PricePerKg { get; set; }

    [Column("status_id")]
    public OliveLotStatus Status { get; set; } = OliveLotStatus.Available;

    // Le lot doit être analysé (analyse terminée) avant d'être pressé.
    [Column("need_analysis")]
    public bool NeedAnalysis { get; set; }

    // Récolte : analyse partagée par ses lots. Achat : une analyse par lot.
    [Column("olive_analysis_id")]
    public int? OliveAnalysisId { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; }

    public bool IsPressable =>
        RemainingKg > 0 &&
        Status is OliveLotStatus.Available or OliveLotStatus.PartiallyUsed;

    // Statut déduit du restant, quand le lot n'est pas clôturé ni vidé.
    public void RefreshStatus()
    {
        if (Status is OliveLotStatus.Closed or OliveLotStatus.Empty)
        {
            return;
        }

        Status = RemainingKg >= QuantityKg
            ? OliveLotStatus.Available
            : RemainingKg <= 0
                ? OliveLotStatus.Processing
                : OliveLotStatus.PartiallyUsed;
    }
}
