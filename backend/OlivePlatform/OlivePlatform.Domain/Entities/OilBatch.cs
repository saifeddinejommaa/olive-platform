
namespace OlivePlatform.Domain.Entities;

public class OilBatch
{
    public int Id { get; set; }
    public string BatchNumber { get; private set; } = null!;

    public int ProductionBatchId { get; private set; }

    public DateOnly ProductionDate { get; private set; }

    public decimal QuantityLiters { get; private set; }

    public string? QualityGrade { get; private set; }

    public string Status { get; private set; }

    public string? Notes { get; private set; }

}