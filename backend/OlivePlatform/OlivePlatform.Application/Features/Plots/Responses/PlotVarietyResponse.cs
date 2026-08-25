namespace OlivePlatform.Application.Features.Plots.Responses;

public class PlotVarietyResponse
{
    public int Id { get; set; }

    public int VarietyId { get; set; }

    public string VarietyName { get; set; } = string.Empty;

    public int NumberOfTrees { get; set; }

    public decimal Percentage { get; set; }

    public string? Notes { get; set; }
}