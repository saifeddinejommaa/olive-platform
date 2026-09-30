using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Météo constatée au lancement d'une récolte (une ligne par récolte).
[Table("harvest_start_weather")]
public class HarvestStartWeather
{
    [Column("harvest_id")]
    public int HarvestId { get; set; }

    [Column("checked_at", TypeName = "timestamp with time zone")]
    public DateTime CheckedAt { get; set; }

    [Column("weather_date")]
    public DateOnly WeatherDate { get; set; }

    [Column("temp_min")]
    public decimal? TempMin { get; set; }

    [Column("temp_max")]
    public decimal? TempMax { get; set; }

    [Column("precipitation_mm")]
    public decimal? PrecipitationMm { get; set; }

    [Column("precipitation_probability")]
    public decimal? PrecipitationProbability { get; set; }

    [Column("wind_speed_kmh")]
    public decimal? WindSpeedKmh { get; set; }

    // Pluie cumulée des 2 jours précédents.
    [Column("previous_rain_mm")]
    public decimal? PreviousRainMm { get; set; }

    [Column("conditions")]
    public string? Conditions { get; set; }

    // ok, info, warning ou danger.
    [Column("level")]
    public string Level { get; set; } = "ok";

    // Conseils affichés : [{ code, level, message }].
    [Column("warnings", TypeName = "jsonb")]
    public string Warnings { get; set; } = "[]";

    // Lancée alors que la météo était défavorable (warning ou danger), après confirmation.
    [Column("started_despite_warning")]
    public bool StartedDespiteWarning { get; set; }
}
