using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Ligne de vente : l'huile vendue depuis une citerne.
[Table("oil_sale_lines")]
public class OilSaleLine
{
    public const string PriceUnitKg = "kg";

    public const string PriceUnitLiter = "L";

    [Column("id")]
    public int Id { get; set; }

    [Column("oil_sale_id")]
    public int OilSaleId { get; set; }

    [Column("tank_id")]
    public int TankId { get; set; }

    // Catégorie vendue (celle de la citerne au moment de la vente).
    [Column("oil_category_id")]
    public OilCategory OilCategory { get; set; }

    // Sortie de citerne.
    [Column("quantity_liters")]
    public decimal QuantityLiters { get; set; }

    // Poids du ticket de pesée (obligatoire pour un prix au kg).
    [Column("quantity_kg")]
    public decimal? QuantityKg { get; set; }

    [Column("price_unit")]
    public string PriceUnit { get; set; } = PriceUnitKg;

    // Prix HT par kg ou par litre.
    [Column("unit_price")]
    public decimal UnitPrice { get; set; }

    // HT.
    [Column("amount")]
    public decimal Amount { get; set; }

    public void ComputeAmount()
    {
        var quantity = PriceUnit == PriceUnitKg ? QuantityKg ?? 0 : QuantityLiters;

        Amount = Math.Round(quantity * UnitPrice, 3);
    }
}
