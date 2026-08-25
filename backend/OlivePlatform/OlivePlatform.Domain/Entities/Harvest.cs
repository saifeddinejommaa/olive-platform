using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("harvests")]
public class Harvest
{
    [Column("id")]
    public int Id { get; set; }

    [Column("reference")]
    public string Reference { get; set; } = null!;

    [Column("plot_id")]
    public int PlotId { get; set; }

    [Column("harvest_date")]
    public DateOnly HarvestDate { get; set; }

    [Column("quantity_kg")]
    public decimal QuantityKg { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("variety_id")]
    public int VarietyId { get; set; }

    [Column("start_time")]
    public DateTime? StartTime { get; set; }

    [Column("end_time")]
    public DateTime? EndTime { get; set; }

    [Column("harvested_trees")]
    public int? HarvestedTrees { get; set; }

    [Column("planned_trees")]
    public int? PlannedTrees { get; set; }


    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("status")]
    public ProductionStatus Status { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}