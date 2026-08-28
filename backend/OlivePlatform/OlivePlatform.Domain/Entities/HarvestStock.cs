using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities
{
    [Table("harvest_stock")]
    public class HarvestStock
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("harvest_id")]
        public long HarvestId { get; set; }

        [Column("reference")]
        public string Reference { get; set; } = null!;

        [Column("quantity_kg")]
        public decimal QuantityKg { get; set; }

        [Column("status")]
        public HarvestStockStatus Status { get; set; } = HarvestStockStatus.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}