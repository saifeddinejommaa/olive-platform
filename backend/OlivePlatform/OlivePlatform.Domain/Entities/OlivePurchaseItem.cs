namespace OlivePlatform.Domain.Entities;

public class OlivePurchaseItem
{
    public int Id { get; set; }
    public int PurchaseId { get; private set; }
    public int? VarietyId { get; private set; }

    public string? Description { get; private set; }

    public decimal AgreedQuantityKg { get; private set; }
    public decimal PricePerKg { get; private set; }

    public OlivePurchase Purchase { get; private set; } = null!;
    public OliveVariety? Variety { get; private set; }

    public ICollection<ProductionBatchInput> ProductionInputs
    { get; private set; } = new List<ProductionBatchInput>();

    private OlivePurchaseItem()
    {
    }

    public OlivePurchaseItem(
        int purchaseId,
        decimal agreedQuantityKg,
        decimal pricePerKg,
        int? varietyId = null)
    {
        PurchaseId = purchaseId;
        AgreedQuantityKg = agreedQuantityKg;
        PricePerKg = pricePerKg;
        VarietyId = varietyId;
    }

    public decimal GetTotalAmount()
    {
        return AgreedQuantityKg * PricePerKg;
    }
}