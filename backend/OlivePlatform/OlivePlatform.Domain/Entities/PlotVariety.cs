using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities
{
    [Table("plot_varieties")]
    public class PlotVariety 
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("plot_id")]
        public int PlotId { get; set; }

        [Column("variety_id")]
        public int VarietyId { get; set; }

        [Column("number_of_trees")]
        public int NumberOfTrees { get; set; }

        [Column("percentage")]
        public decimal Percentage { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
