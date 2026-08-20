namespace OlivePlatform.Domain.Entities;

public class OlivePurchaseItem
{
    public int Id { get; set; }
    public string Reference { get; set; }
    public int PurchaseId { get; private set; }
    public int? VarietyId { get; private set; }

    public string? Description { get; private set; }

    public decimal AgreedQuantityKg { get; private set; }
    public decimal PricePerKg { get; private set; }

    public OlivePurchase Purchase { get; private set; } = null!;
    public OliveVariety? Variety { get; private set; }
}