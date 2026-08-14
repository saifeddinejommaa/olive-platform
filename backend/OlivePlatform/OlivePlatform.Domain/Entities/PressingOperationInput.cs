
namespace OlivePlatform.Domain.Entities;

public class PressingOperationInput
{
    public int Id { get; set; }
    public int ProductionBatchId { get; private set; }

    public int? HarvestId { get; private set; }

    public int? PurchaseItemId { get; private set; }

    public decimal QuantityKg { get; private set; }

    public string? Notes { get; private set; }

    public PressingOperation ProductionBatch { get; private set; } = null!;

    public Harvest? Harvest { get; private set; }

    public OlivePurchaseItem? PurchaseItem { get; private set; }

    private PressingOperationInput()
    {
    }

    public PressingOperationInput(
        int productionBatchId,
        decimal quantityKg,
        int? harvestId = null,
        int? purchaseItemId = null)
    {
        if (harvestId is null && purchaseItemId is null)
            throw new ArgumentException(
                "Either HarvestId or PurchaseItemId must be provided.");

        ProductionBatchId = productionBatchId;
        QuantityKg = quantityKg;
        HarvestId = harvestId;
        PurchaseItemId = purchaseItemId;
    }
}