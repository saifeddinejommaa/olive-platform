using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OilSales.Responses;

public class OilSaleForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Reference { get; set; } = null!;

    public DateTime SaleDate { get; set; }

    public int CustomerId { get; set; }

    public string CustomerName { get; set; } = null!;

    public OilSaleStatus Status { get; set; }

    public string StatusLabel { get; set; } = string.Empty;

    // Citernes vendues (« code · catégorie », séparées par des virgules).
    public string? Tanks { get; set; }

    public decimal QuantityLiters { get; set; }

    public decimal? QuantityKg { get; set; }

    public decimal TotalAmount { get; set; }

    // Encaissé et reste à payer (TTC).
    public decimal PaidAmount { get; set; }

    public decimal RemainingAmount { get; set; }
}

public class OilSaleDetailsResponse : OilSaleForListResponse
{
    public int SeasonId { get; set; }

    public string CustomerReference { get; set; } = null!;

    public string? CustomerPhone { get; set; }

    public string? CustomerTaxId { get; set; }

    public decimal TaxRate { get; set; }

    public decimal Subtotal { get; set; }

    public decimal TaxAmount { get; set; }

    public DateTime? DeliveredAt { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<OilSaleLineResponse> Lines { get; set; } = [];

    public List<OilSalePaymentResponse> Payments { get; set; } = [];
}

// Encaissement d'une vente.
public class OilSalePaymentResponse
{
    public int Id { get; set; }

    public DateTime PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public string PaymentMethodLabel { get; set; } = string.Empty;

    public string? Reference { get; set; }

    public string? Notes { get; set; }
}

public class OilSaleLineResponse
{
    public int Id { get; set; }

    public int TankId { get; set; }

    public string TankCode { get; set; } = null!;

    public string? TankName { get; set; }

    public OilCategory OilCategory { get; set; }

    public string OilCategoryLabel { get; set; } = string.Empty;

    public decimal QuantityLiters { get; set; }

    public decimal? QuantityKg { get; set; }

    public string PriceUnit { get; set; } = null!;

    public decimal UnitPrice { get; set; }

    public decimal Amount { get; set; }

    // Mouvements « Sortie vente » créés à la livraison.
    public string? MovementNumbers { get; set; }
}
