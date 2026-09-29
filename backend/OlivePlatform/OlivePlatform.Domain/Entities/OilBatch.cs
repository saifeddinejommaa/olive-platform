using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Lot d'huile : l'huile produite par une pression.
[Table("oil_batches")]
public class OilBatch
{
    public const string PendingAnalysisStatus = "pending_analysis";

    // Huile analysée, transférée dans la citerne de stockage de sa catégorie.
    public const string StoredStatus = "stored";

    [Column("id")]
    public int Id { get; set; }

    [Column("batch_number")]
    public string BatchNumber { get; set; } = null!;

    // Pression d'origine.
    [Column("production_batch_id")]
    public int ProductionBatchId { get; set; }

    [Column("production_date")]
    public DateOnly ProductionDate { get; set; }

    [Column("quantity_liters")]
    public decimal QuantityLiters { get; set; }

    [Column("quality_grade")]
    public string? QualityGrade { get; set; }

    [Column("status")]
    public string Status { get; set; } = PendingAnalysisStatus;

    [Column("notes")]
    public string? Notes { get; set; }
}
