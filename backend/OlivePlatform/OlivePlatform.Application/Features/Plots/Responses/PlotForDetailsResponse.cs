namespace OlivePlatform.Application.Features.Plots.Responses;

public class PlotForDetailsResponse
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal AreaHectares { get; set; }

    public int NumberOfTrees { get; set; }

    public int? PlantingYear { get; set; }

    public string? Location { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; }

    public IReadOnlyList<PlotVarietyResponse> Varieties { get; set; }
        = [];

    public IReadOnlyList<HarvestSummaryResponse> Harvests { get; set; }
        = [];
}

public class PlotVarietyResponse
{
    public int VarietyId { get; set; }

    public string VarietyName { get; set; } = null!;

    public int? NumberOfTrees { get; set; }

    public decimal? Percentage { get; set; }
}

public class HarvestSummaryResponse
{
    public int Id { get; set; }

    public string HarvestNumber { get; set; } = null!;

    public DateOnly HarvestDate { get; set; }

    public decimal QuantityKg { get; set; }
}