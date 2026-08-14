
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = null!;

    public InvoiceType? InvoiceType { get; set; }

    public string? SupplierName { get; set; }
    public string? CustomerName { get; set; }

    public DateTime InvoiceDate { get; set; }
    public DateTime? DueDate { get; set; }

    public decimal Subtotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }

    public InvoiceStatus? Status { get; set; }

    public string? Notes { get; set; }

    public ICollection<InvoiceItem> Items { get; set; }
        = new List<InvoiceItem>();

    public ICollection<Payment> Payments { get; set; }
        = new List<Payment>();

}