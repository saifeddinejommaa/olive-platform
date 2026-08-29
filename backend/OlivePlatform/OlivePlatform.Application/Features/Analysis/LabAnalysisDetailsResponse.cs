namespace OlivePlatform.Application.Features.Laboratory.Responses;

public class LabAnalysisDetailsResponse
{
    public int Id { get; set; }

    public string AnalysisNumber { get; set; } = null!;

    public int SampleId { get; set; }

    public string SampleNumber { get; set; } = null!;

    public DateTimeOffset AnalysisDate { get; set; }

    public string? AnalystName { get; set; }

    public string? GeneralQuality { get; set; }

    public decimal? EstimatedOilYield { get; set; }

    public string? Notes { get; set; }

    public IReadOnlyList<LabAnalysisResultResponse> Results { get; set; }
        = [];
}

public class LabAnalysisResultResponse
{
    public int Id { get; set; }

    public string ParameterName { get; set; } = null!;

    public decimal? ValueNumeric { get; set; }

    public string? ValueText { get; set; }

    public string? Unit { get; set; }

    public string? Notes { get; set; }
}