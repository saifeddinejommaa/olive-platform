using System.ComponentModel.DataAnnotations.Schema;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities
{
    [Table("oil_analyses")]
    public class OilAnalysis
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("season_id")]
        public int SeasonId { get; set; }

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

        [Column("planned_date", TypeName = "timestamp with time zone")]
        public DateTime? PlannedDate { get; set; }

        [Column("start_time", TypeName = "timestamp with time zone")]
        public DateTime? StartTime { get; set; }

        [Column("end_time", TypeName = "timestamp with time zone")]
        public DateTime? EndTime { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("status")]
        public ProductionStatus Status { get; set; }
    }
}