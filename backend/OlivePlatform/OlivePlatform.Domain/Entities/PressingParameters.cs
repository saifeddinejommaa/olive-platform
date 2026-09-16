namespace OlivePlatform.Domain.Entities;

public class PressingParameters
{
    public int Id { get; set; }
    public int PressingOperationId { get; set; }

    public int? ProcessTypeId { get; set; }
    public int? MillId { get; set; }

    public decimal? MalaxingTemperatureC { get; set; }
    public int? MalaxingDurationMinutes { get; set; }
    public decimal? MalaxingSpeedRpm { get; set; }

    public decimal? FeedRateKgH { get; set; }

    public decimal? DecanterSpeedRpm { get; set; }
    public decimal? DecanterDifferentialRpm { get; set; }

    public decimal? CentrifugeSpeedRpm { get; set; }

    public decimal? AddedWaterLiters { get; set; }
    public decimal? WaterTemperatureC { get; set; }

    public int? WaitingTimeBeforeExtractionMinutes { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}