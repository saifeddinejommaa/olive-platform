using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Encaissement d'une vente d'huile : argent reçu du client.
[Table("oil_sale_payments")]
public class OilSalePayment
{
    [Column("id")]
    public int Id { get; set; }

    [Column("oil_sale_id")]
    public int OilSaleId { get; set; }

    [Column("payment_date")]
    public DateOnly PaymentDate { get; set; }

    [Column("amount")]
    public decimal Amount { get; set; }

    // Espèce, chèque ou virement (table payment_method).
    [Column("payment_method_id")]
    public PaymentMethod PaymentMethod { get; set; }

    // N° de chèque ou de virement.
    [Column("reference")]
    public string? Reference { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; }
}
