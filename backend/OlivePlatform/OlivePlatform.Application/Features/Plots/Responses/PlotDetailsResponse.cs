namespace OlivePlatform.Application.Features.Plots.Responses;

public class PlotDetailResponse
{
    public int Id { get; set; }
    public string Reference { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal? AreaHectares { get; set; }
    public int NumberOfTrees { get; set; }
    public int? PlantingYear { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public double HarvestedTreesPercentage { get; set; }

    public double PlannedTreesPercentage { get; set; }
    public bool CanLaunchHarvest { get; set; }

    public List<PlotVarietyDetail> Varieties { get; set; } = new();
}