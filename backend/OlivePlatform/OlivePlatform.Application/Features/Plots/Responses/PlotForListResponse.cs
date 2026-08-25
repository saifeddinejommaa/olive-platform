namespace OlivePlatform.Application.Features.Plots.Responses;

public class PlotForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Reference { get; set; }

    public decimal AreaHectares { get; set; }

    public int NumberOfTrees { get; set; }

    public int PlantingYear { get; set; }

    public string Location { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<PlotVarietyResponse> Varieties { get; set; } = [];
}