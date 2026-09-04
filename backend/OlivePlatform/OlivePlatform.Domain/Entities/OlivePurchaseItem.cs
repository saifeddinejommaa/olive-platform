using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("olive_purchase_items")]
public class OlivePurchaseItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("reference")]
    public required string Reference { get; set; }

    [Column("purchase_id")]
    public int PurchaseId { get;  set; }

    [Column("variety_id")]
    public int VarietyId { get;  set; }

    [Column("agreed_quantity_kg")]
    public decimal AgreedQuantityKg { get;  set; }

    [Column("price_per_kg")]
    public decimal PricePerKg { get;  set; }

    [Column("created_at")]
    public DateTime CreatedAt { get;  set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get;  set; }

    public OlivePurchase Purchase { get; set; }

}