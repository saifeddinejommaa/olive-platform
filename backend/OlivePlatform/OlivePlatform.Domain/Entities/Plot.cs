using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities
{
    [Table("plots")]
    public class Plot
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("reference")]
        public string Reference { get; set; } = null!;

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("area_hectares")]
        public decimal AreaHectares { get; set; }


        [Column("planting_year")]
        public int PlantingYear { get; set; }

        [Column("location")]
        public string Location { get; set; }

        [Column("number_of_trees")]
        public int NumberOfTrees { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
