
namespace OlivePlatform.Domain.Entities;

public class InvoiceItem
{
    public int Id { get; set; }
    public int InvoiceId { get; private set; }

    public string Description { get; private set; } = null!;

    public decimal Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }

    public decimal TaxRate { get; private set; }
}