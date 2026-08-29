using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("oil_analyses")]
public class OilAnalysis
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("source_type_id")]
    public int SourceTypeId { get; set; }

    [Column("source_id")]
    public int SourceId { get; set; }

    [Column("primary_oxidation")]
    public decimal PrimaryOxidation { get; set; }

    [Column("secondary_oxidation")]
    public decimal SecondaryOxidation { get; set; }

    [Column("analysis_date")]
    public DateTime AnalysisDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
