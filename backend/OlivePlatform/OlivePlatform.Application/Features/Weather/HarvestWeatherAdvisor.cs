using OlivePlatform.Application.Features.Seasons;

namespace OlivePlatform.Application.Features.Weather;

// Niveaux d'un conseil météo, du plus léger au plus grave.
public static class WeatherAdviceLevel
{
    public const string Ok = "ok";
    public const string Info = "info";
    public const string Warning = "warning";
    public const string Danger = "danger";

    private static readonly string[] Order = [Ok, Info, Warning, Danger];

    public static int Rank(string level) => Array.IndexOf(Order, level);

    public static string Max(IEnumerable<string> levels) =>
        levels.DefaultIfEmpty(Ok).MaxBy(Rank) ?? Ok;
}

// Un conseil : code stable (pour le front), niveau et message.
public record WeatherWarning(string Code, string Level, string Message);

/// <summary>
/// Règles de conseil météo pour la récolte des olives. Seule source des
/// règles : le web et le mobile affichent ce qu'elles renvoient.
/// </summary>
public static class HarvestWeatherAdvisor
{
    // Pluie le jour J : cueillette difficile, olives mouillées.
    public const decimal RainMm = 5m;
    public const decimal RainProbability = 60m;

    // Pluie cumulée des 2 jours précédents : olives gorgées d'eau.
    public const decimal WetOlivesMm = 10m;

    // Gel le jour J ou la veille : fruits abîmés.
    public const decimal FrostTempMin = 0m;

    // Vent fort : sécurité (filets, échelles), chute des olives.
    public const decimal WindKmh = 40m;

    // Chaleur : l'olive fermente vite après la récolte.
    public const decimal HeatTempMax = 28m;

    // Conseils pour un jour de récolte, à partir de la météo autour de ce jour.
    public static List<WeatherWarning> Evaluate(IReadOnlyList<WeatherDay> days, DateOnly date)
    {
        var warnings = new List<WeatherWarning>();

        var day = days.FirstOrDefault(item => item.Date == date);

        if (day is null)
        {
            return warnings;
        }

        var previousDay = days.FirstOrDefault(item => item.Date == date.AddDays(-1));

        if ((day.PrecipitationMm ?? 0) >= RainMm || (day.PrecipitationProbability ?? 0) >= RainProbability)
        {
            warnings.Add(new WeatherWarning(
                "rain",
                WeatherAdviceLevel.Warning,
                $"Pluie prévue ({FormatMm(day.PrecipitationMm)}, {day.PrecipitationProbability ?? 0:0} %) : olives mouillées, cueillette difficile, rendement en huile plus faible."));
        }

        var previousRain = days
            .Where(item => item.Date >= date.AddDays(-2) && item.Date < date)
            .Sum(item => item.PrecipitationMm ?? 0);

        if (previousRain >= WetOlivesMm)
        {
            warnings.Add(new WeatherWarning(
                "wet-olives",
                WeatherAdviceLevel.Warning,
                $"{FormatMm(previousRain)} de pluie les 2 jours avant : olives gorgées d'eau, plus d'humidité et moins d'huile par kilo."));
        }

        var frost = new[] { day, previousDay }
            .Where(item => item is not null && item.TempMin is not null && item.TempMin <= FrostTempMin)
            .Select(item => item!.TempMin!.Value)
            .ToList();

        if (frost.Count > 0)
        {
            warnings.Add(new WeatherWarning(
                "frost",
                WeatherAdviceLevel.Danger,
                $"Gel prévu ({frost.Min():0.#} °C) : olives abîmées, risque de défauts de l'huile. Récolte déconseillée."));
        }

        if ((day.WindSpeedKmh ?? 0) >= WindKmh)
        {
            warnings.Add(new WeatherWarning(
                "wind",
                WeatherAdviceLevel.Warning,
                $"Vent fort ({day.WindSpeedKmh:0} km/h) : risque pour les filets et les échelles, chute des olives."));
        }

        if ((day.TempMax ?? 0) >= HeatTempMax)
        {
            warnings.Add(new WeatherWarning(
                "heat",
                WeatherAdviceLevel.Info,
                $"Chaleur ({day.TempMax:0} °C) : l'olive fermente vite, pressez dans les 24 h après la récolte."));
        }

        return warnings;
    }

    /// <summary>
    /// Jour conseillé : le jour sans alerte (au plus « info ») le plus proche de
    /// la date choisie, à partir d'aujourd'hui ; à égalité, le plus tardif.
    /// </summary>
    public static DateOnly? SuggestDate(
        IReadOnlyList<WeatherDay> days,
        DateOnly date,
        DateOnly today,
        DateOnly lastForecastDay)
    {
        return days
            .Select(item => item.Date)
            .Where(candidate =>
                candidate != date
                && candidate >= today
                && candidate <= lastForecastDay
                && SeasonCalendar.IsInHarvestWindow(candidate)
                && WeatherAdviceLevel.Rank(WeatherAdviceLevel.Max(Evaluate(days, candidate).Select(w => w.Level)))
                    <= WeatherAdviceLevel.Rank(WeatherAdviceLevel.Info))
            .OrderBy(candidate => Math.Abs(candidate.DayNumber - date.DayNumber))
            .ThenByDescending(candidate => candidate)
            .Cast<DateOnly?>()
            .FirstOrDefault();
    }

    private static string FormatMm(decimal? value) => $"{value ?? 0:0.#} mm";
}
