namespace OlivePlatform.Application.Features.OilBatches.Responses;

public class OilBatchForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string BatchNumber { get; set; } = null!;

    public int ProductionBatchId { get; set; }

    public string ProductionBatchNumber { get; set; } = null!;

    public DateOnly ProductionDate { get; set; }

    public decimal QuantityLiters { get; set; }

    public decimal CurrentQuantityLiters { get; set; }

    public string? QualityGrade { get; set; }

    public string Status { get; set; } = null!;
}