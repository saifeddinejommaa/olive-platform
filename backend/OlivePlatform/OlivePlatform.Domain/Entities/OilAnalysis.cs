using System.ComponentModel.DataAnnotations.Schema;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities
{
    [Table("oil_analyses")]
    public class OilAnalysis
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("reference")]
        public string Reference { get; set; } = string.Empty;

        [Column("source_type_id")]
        public OilAnalysisSourceType SourceTypeId { get; set; }

        [Column("source_id")]
        public int SourceId { get; set; }

        [Column("acidity_percentage")]
        public decimal? AcidityPercentage { get; set; }

        [Column("peroxide_index")]
        public decimal? PeroxideIndex { get; set; }

        [Column("k232")]
        public decimal? K232 { get; set; }

        [Column("k270")]
        public decimal? K270 { get; set; }

        [Column("organoleptic_grade")]
        public int? OrganolepticGrade { get; set; }

        [Column("analysis_date")]
        public DateTime? AnalysisDate { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("status")]
        public ProductionStatus Status { get; set; }
    }
}