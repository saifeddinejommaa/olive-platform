using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Invoices.Responses;

public class InvoiceForDetailsResponse
{
    public int Id { get; set; }

    public string InvoiceNumber { get; set; } = null!;

    public InvoiceType InvoiceType { get; set; }

    public string? SupplierName { get; set; }

    public string? CustomerName { get; set; }

    public DateOnly InvoiceDate { get; set; }

    public DateOnly? DueDate { get; set; }

    public decimal Subtotal { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public InvoiceStatus Status { get; set; }

    public string? Notes { get; set; }

    public IReadOnlyList<InvoiceItemResponse> Items { get; set; }
        = [];

    public IReadOnlyList<PaymentSummaryResponse> Payments { get; set; }
        = [];
}

public class InvoiceItemResponse
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public decimal Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal TaxRate { get; set; }

    public decimal Total { get; set; }
}

public class PaymentSummaryResponse
{
    public int Id { get; set; }

    public string PaymentNumber { get; set; } = null!;

    public DateTimeOffset PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }
}