namespace OlivePlatform.Domain.Entities;

public class LabAnalysisResult
{
    public int Id { get; set; }
    public int AnalysisId { get; private set; }

    public string ParameterName { get; private set; } = null!;

    public decimal? ValueNumeric { get; private set; }

    public string? ValueText { get; private set; }

    public string? Unit { get; private set; }

    public string? Notes { get; private set; }
}