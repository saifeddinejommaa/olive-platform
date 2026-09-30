using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Application.Features.Weather;

public interface IHarvestWeatherService
{
    // Conseil météo pour récolter une parcelle à une date (planification ou lancement).
    Task<HarvestWeatherAdviceResponse> GetAdviceAsync(
        Plot plot,
        DateOnly date,
        CancellationToken cancellationToken = default);
}

public class HarvestWeatherService : IHarvestWeatherService
{
    // Horizon de prévision fiable de Visual Crossing.
    private const int ForecastHorizonDays = 14;

    private readonly IWeatherClient _weatherClient;

    public HarvestWeatherService(IWeatherClient weatherClient)
    {
        _weatherClient = weatherClient;
    }

    public async Task<HarvestWeatherAdviceResponse> GetAdviceAsync(
        Plot plot,
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        var response = new HarvestWeatherAdviceResponse
        {
            PlotId = plot.Id,
            PlotReference = plot.Reference,
            PlotName = plot.Name,
            Date = date,
        };

        var today = SeasonCalendar.ToBusinessDate(DateTime.UtcNow);
        var lastForecastDay = today.AddDays(ForecastHorizonDays);

        if (plot.Latitude is null || plot.Longitude is null)
        {
            return WithInfo(response, "no-gps",
                $"La parcelle {plot.Reference} n'a pas de coordonnées GPS : renseignez-les pour obtenir la météo.");
        }

        if (date < today)
        {
            return WithInfo(response, "past-date", "Date passée : pas de conseil météo.");
        }

        if (date > lastForecastDay)
        {
            return WithInfo(response, "too-far",
                $"Prévision disponible à {ForecastHorizonDays} jours : revenez consulter la météo à l'approche de la date.");
        }

        // J-2 (pluie des jours précédents) à J+7 (jour conseillé), dans l'horizon de prévision.
        var from = date.AddDays(-2);
        var to = date.AddDays(7) > lastForecastDay ? lastForecastDay : date.AddDays(7);

        var days = await _weatherClient.GetDailyAsync(
            plot.Latitude.Value,
            plot.Longitude.Value,
            from,
            to,
            cancellationToken);

        var day = days.FirstOrDefault(item => item.Date == date);

        if (day is null)
        {
            return WithInfo(response, "unavailable", "Météo indisponible pour le moment.");
        }

        response.ForecastAvailable = true;
        response.Day = day;
        response.PreviousRainMm = days
            .Where(item => item.Date >= date.AddDays(-2) && item.Date < date)
            .Sum(item => item.PrecipitationMm ?? 0);
        response.Warnings = HarvestWeatherAdvisor.Evaluate(days, date);
        response.Level = WeatherAdviceLevel.Max(response.Warnings.Select(warning => warning.Level));

        // Jour conseillé seulement si la date choisie pose problème.
        if (WeatherAdviceLevel.Rank(response.Level) >= WeatherAdviceLevel.Rank(WeatherAdviceLevel.Warning))
        {
            response.SuggestedDate = HarvestWeatherAdvisor.SuggestDate(days, date, today, to);
            response.SuggestedDay = days.FirstOrDefault(item => item.Date == response.SuggestedDate);
        }

        return response;
    }

    private static HarvestWeatherAdviceResponse WithInfo(
        HarvestWeatherAdviceResponse response,
        string code,
        string message)
    {
        response.Level = WeatherAdviceLevel.Info;
        response.Warnings = [new WeatherWarning(code, WeatherAdviceLevel.Info, message)];
        return response;
    }
}
