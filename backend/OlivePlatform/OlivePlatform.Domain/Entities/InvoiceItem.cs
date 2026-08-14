
namespace OlivePlatform.Domain.Entities;

public class InvoiceItem
{
    public int Id { get; set; }
    public int InvoiceId { get; private set; }

    public string Description { get; private set; } = null!;

    public decimal Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }

    public decimal TaxRate { get; private set; }

    public Invoice Invoice { get; private set; } = null!;

    private InvoiceItem()
    {
    }

    public InvoiceItem(
        int invoiceId,
        string description,
        decimal quantity,
        decimal unitPrice,
        decimal taxRate = 0)
    {
        InvoiceId = invoiceId;
        Description = description;
        Quantity = quantity;
        UnitPrice = unitPrice;
        TaxRate = taxRate;
    }

    public decimal GetTotal()
    {
        return Quantity * UnitPrice;
    }
}