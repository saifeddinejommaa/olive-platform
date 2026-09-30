using OlivePlatform.Application.Features.Weather;

namespace OlivePlatform.Application.Features.Harvests.Responses;

// Météo constatée au lancement de la récolte.
public class HarvestStartWeatherResponse
{
    public DateTime CheckedAt { get; set; }

    public DateOnly WeatherDate { get; set; }

    public decimal? TempMin { get; set; }

    public decimal? TempMax { get; set; }

    public decimal? PrecipitationMm { get; set; }

    public decimal? PrecipitationProbability { get; set; }

    public decimal? WindSpeedKmh { get; set; }

    public decimal? PreviousRainMm { get; set; }

    public string? Conditions { get; set; }

    public string Level { get; set; } = WeatherAdviceLevel.Ok;

    public List<WeatherWarning> Warnings { get; set; } = [];

    public bool StartedDespiteWarning { get; set; }
}
