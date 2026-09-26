

using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("olive_purchases")]
public class OlivePurchase
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("season_id")]
    public int SeasonId { get; set; }

    [Column("reference")]
    public string Reference { get; set; } = null!;

    [Column("supplier_id")]
    public int? SupplierId { get; set; }

    [Column("purchase_date")]
    public DateOnly PurchaseDate { get; set; }

    [Column("status_id")]
    public PurchaseStatus Status { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [Column("notes")]
    public string? Notes { get;   set; }

    [Column("paid_amount")]
    public decimal? PaidAmount { get; set; }

    [Column("unpaid_amount")]
    public decimal? UnpaidAmount { get; set; }

    [Column("is_paid")]
    public bool IsPaid { get; set; }

    public ICollection<OlivePurchaseItem> Items { get; set; }
       = new List<OlivePurchaseItem>();

}