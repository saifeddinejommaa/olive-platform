using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses
{
    public class OlivePurchaseItemForListResponse
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("reference")]
        public required string Reference { get; set; }

        [Column("variety_id")]
        public int? VarietyId { get; private set; }

        [Column("agreeded_id")]
        public decimal AgreedQuantityKg { get; private set; }

        [Column("price_per_kg")]
        public decimal PricePerKg { get; private set; }
    }
}
