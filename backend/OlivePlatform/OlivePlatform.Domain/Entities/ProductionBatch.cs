using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class ProductionBatch
{
    public int Id { get; set; }
    public string BatchNumber { get; set; } = null!;

    public DateOnly ProductionDate { get; set; }

    public DateTimeOffset? StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }

    public ProductionStatus Status { get; set; }

    public decimal? OliveQuantityKg { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public decimal? YieldPercentage { get; set; }

    public string? Notes { get; set; }

    public ICollection<ProductionBatchInput> Inputs { get; set; }
        = new List<ProductionBatchInput>();

    public ICollection<OilBatch> OilBatches { get; set; }
        = new List<OilBatch>();

    public void Start()
    {
        Status = ProductionStatus.InProgress;
        StartTime = DateTimeOffset.UtcNow;
    }

    public void Complete(
        decimal oliveQuantityKg,
        decimal oilQuantityLiters)
    {
        OliveQuantityKg = oliveQuantityKg;
        OilQuantityLiters = oilQuantityLiters;

        if (oliveQuantityKg > 0)
        {
            YieldPercentage =
                oilQuantityLiters / oliveQuantityKg * 100;
        }

        EndTime = DateTimeOffset.UtcNow;
        Status = ProductionStatus.Completed;
    }

    public void Cancel()
    {
        Status = ProductionStatus.Cancelled;
    }
}