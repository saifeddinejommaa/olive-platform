using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Vente d'huile en vrac : une ligne par citerne.
[Table("oil_sales")]
public class OilSale
{
    [Column("id")]
    public int Id { get; set; }

    // VTE-AAAA-001
    [Column("reference")]
    public string Reference { get; set; } = null!;

    [Column("season_id")]
    public int SeasonId { get; set; }

    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Column("sale_date")]
    public DateOnly SaleDate { get; set; }

    [Column("status_id")]
    public OilSaleStatus Status { get; set; } = OilSaleStatus.Draft;

    // TVA en %.
    [Column("tax_rate")]
    public decimal TaxRate { get; set; }

    // HT.
    [Column("subtotal")]
    public decimal Subtotal { get; set; }

    [Column("tax_amount")]
    public decimal TaxAmount { get; set; }

    // TTC.
    [Column("total_amount")]
    public decimal TotalAmount { get; set; }

    // Sortie des citernes (validation de la vente).
    [Column("delivered_at", TypeName = "timestamp with time zone")]
    public DateTime? DeliveredAt { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; }

    public List<OilSaleLine> Lines { get; set; } = [];

    // Recalcule les montants HT, TVA et TTC depuis les lignes.
    public void ComputeTotals()
    {
        Subtotal = Math.Round(Lines.Sum(line => line.Amount), 3);
        TaxAmount = Math.Round(Subtotal * TaxRate / 100, 3);
        TotalAmount = Subtotal + TaxAmount;
    }
}
