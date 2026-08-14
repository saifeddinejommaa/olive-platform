namespace OlivePlatform.Application.Features.Plots.Responses;

public class PlotForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal AreaHectares { get; set; }

    public int NumberOfTrees { get; set; }

    public int? PlantingYear { get; set; }

    public string? Location { get; set; }

    public bool IsActive { get; set; }
}