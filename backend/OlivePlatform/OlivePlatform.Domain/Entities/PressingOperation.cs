using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class PressingOperation
{
    public int Id { get; set; }

    public string BatchNumber { get; set; } = null!;

    public DateOnly ProductionDate { get; set; }

    public DateTimeOffset? StartTime { get; set; }

    public DateTimeOffset? EndTime { get; set; }

    public ProductionStatus Status { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public decimal? YieldPercentage { get; set; }

    public string? Notes { get; set; }

    // ============================================================
    // Inputs
    // ============================================================

    public ICollection<PressingOperationInput> Inputs { get; set; }
        = new List<PressingOperationInput>();

    // ============================================================
    // Production d'huile
    // ============================================================

    public ICollection<OilBatch> OilBatches { get; set; }
        = new List<OilBatch>();

    // ============================================================
    // Domain methods
    // ============================================================

    public void Start()
    {
        Status = ProductionStatus.InProgress;
        StartTime = DateTimeOffset.UtcNow;
    }

    public void Complete(decimal oilQuantityLiters)
    {
        var oliveQuantityKg = Inputs.Sum(x => x.QuantityKg);

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