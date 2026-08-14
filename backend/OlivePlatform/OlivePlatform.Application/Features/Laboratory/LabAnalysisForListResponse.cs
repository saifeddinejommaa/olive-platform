namespace OlivePlatform.Application.Features.Laboratory.Responses;

public class LabAnalysisForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string AnalysisNumber { get; set; } = null!;

    public int SampleId { get; set; }

    public string SampleNumber { get; set; } = null!;

    public DateTimeOffset AnalysisDate { get; set; }

    public string? AnalystName { get; set; }

    public string? GeneralQuality { get; set; }

    public decimal? EstimatedOilYield { get; set; }
}