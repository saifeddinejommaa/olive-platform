
using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("olive_analyses")]
public class OliveAnalysis
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("reference")]
    public required string Reference { get; set; }

    [Column("source_type")]
    public InputSourceType SourceType { get; set; }

    [Column("source_id")]
    public int SourceId { get; set; }

    [Column("humidity_percentage", TypeName = "numeric(10,3)")]
    public decimal? HumidityPercentage { get; set; }

    [Column("water_percentage", TypeName = "numeric(10,3)")]
    public decimal? WaterPercentage { get; set; }

    [Column("oil_percentage", TypeName = "numeric(10,3)")]
    public decimal? OilPercentage { get; set; }

    [Column("acidity_percentage", TypeName = "numeric(10,3)")]
    public decimal? AcidityPercentage { get; set; }

    [Column("analysis_date")]
    public DateTime? AnalysisDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [Column("status")]
    public ProductionStatus Status { get; set; }
}
