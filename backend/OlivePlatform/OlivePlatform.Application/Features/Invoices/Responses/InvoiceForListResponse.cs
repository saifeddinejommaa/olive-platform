using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Invoices.Responses;

public class InvoiceForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string InvoiceNumber { get; set; } = null!;

    public InvoiceType InvoiceType { get; set; }

    public string? SupplierName { get; set; }

    public string? CustomerName { get; set; }

    public DateOnly InvoiceDate { get; set; }

    public DateOnly? DueDate { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public InvoiceStatus Status { get; set; }
}