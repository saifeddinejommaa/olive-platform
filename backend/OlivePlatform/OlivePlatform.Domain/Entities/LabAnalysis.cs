namespace OlivePlatform.Domain.Entities;

public class LabAnalysis 
{
    public int Id { get; set; }
    public string AnalysisNumber { get; private set; } = null!;

    public int SampleId { get; private set; }

    public DateTimeOffset AnalysisDate { get; private set; }

    public string? AnalystName { get; private set; }

    public string? GeneralQuality { get; private set; }

    public decimal? EstimatedOilYield { get; private set; }

    public string? Notes { get; private set; }
}