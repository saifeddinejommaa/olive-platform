namespace OlivePlatform.Application.Features.Harvests.Responses;

public class HarvestForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string HarvestNumber { get; set; } = null!;

    public int PlotId { get; set; }

    public string PlotCode { get; set; } = null!;

    public DateOnly HarvestDate { get; set; }

    public decimal QuantityKg { get; set; }

    public string? QualityGrade { get; set; }
}