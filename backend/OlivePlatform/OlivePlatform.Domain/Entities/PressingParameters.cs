using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Configuration de pression : réglages du moulin pour une opération (une par pression).
[Table("pressing_parameters")]
public class PressingParameters
{
    [Column("id")]
    public int Id { get; set; }

    [Column("pressing_operation_id")]
    public int PressingOperationId { get; set; }

    [Column("process_type_id")]
    public int? ProcessTypeId { get; set; }

    [Column("mill_id")]
    public int? MillId { get; set; }

    [Column("malaxing_temperature_c")]
    public decimal? MalaxingTemperatureC { get; set; }

    [Column("malaxing_duration_minutes")]
    public int? MalaxingDurationMinutes { get; set; }

    [Column("malaxing_speed_rpm")]
    public decimal? MalaxingSpeedRpm { get; set; }

    [Column("feed_rate_kg_h")]
    public decimal? FeedRateKgH { get; set; }

    [Column("decanter_speed_rpm")]
    public decimal? DecanterSpeedRpm { get; set; }

    [Column("decanter_differential_rpm")]
    public decimal? DecanterDifferentialRpm { get; set; }

    [Column("centrifuge_speed_rpm")]
    public decimal? CentrifugeSpeedRpm { get; set; }

    [Column("added_water_liters")]
    public decimal? AddedWaterLiters { get; set; }

    [Column("water_temperature_c")]
    public decimal? WaterTemperatureC { get; set; }

    [Column("waiting_time_before_extraction_minutes")]
    public int? WaitingTimeBeforeExtractionMinutes { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; }

    // Au moins un réglage renseigné.
    public bool HasAnyValue() =>
        ProcessTypeId.HasValue
        || MillId.HasValue
        || MalaxingTemperatureC.HasValue
        || MalaxingDurationMinutes.HasValue
        || MalaxingSpeedRpm.HasValue
        || FeedRateKgH.HasValue
        || DecanterSpeedRpm.HasValue
        || DecanterDifferentialRpm.HasValue
        || CentrifugeSpeedRpm.HasValue
        || AddedWaterLiters.HasValue
        || WaterTemperatureC.HasValue
        || WaitingTimeBeforeExtractionMinutes.HasValue;
}
