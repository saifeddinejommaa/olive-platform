
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class Payment
{
    public int Id { get; set; }
    public string PaymentNumber { get;  set; } = null!;

    public DateTimeOffset PaymentDate { get;  set; }

    public decimal Amount { get;  set; }

    public PaymentMethod PaymentMethod { get;  set; }

    public int? InvoiceId { get; set; }

    public string? SupplierName { get;  set; }
    public string? WorkerName { get;  set; }

    public string? Reference { get;  set; }
    public string? Notes { get;  set; }

}