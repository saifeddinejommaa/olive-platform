namespace OlivePlatform.Application.Features.Harvests.Responses;

public class HarvestForListResponse
{
    public int Total { get; set; }
    public int Id { get; set; }

    public string Reference { get; set; } = null!;

    public int PlotId { get; set; }

    public int PlotReference { get; set; }

    public string PlotName { get; set; } = null!;

    public DateOnly HarvestDate { get; set; }

    public decimal QuantityKg { get; set; }

    public string? Notes { get; set; }

    public int Status { get; set; }

    public int HarvestedTrees { get; set; }

    public int VarietyId { get; set; }

    public int PlannedTrees { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? UpdatedAt { get; set; }
}