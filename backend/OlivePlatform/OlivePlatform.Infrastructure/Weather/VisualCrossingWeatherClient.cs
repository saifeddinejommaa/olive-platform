using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OlivePlatform.Application.Features.Weather;

namespace OlivePlatform.Infrastructure.Weather;

/// <summary>
/// Météo journalière via l'API Timeline de Visual Crossing, mise en cache
/// pour économiser le quota.
/// </summary>
public class VisualCrossingWeatherClient : IWeatherClient
{
    // Seuls les champs utiles : réponse plus légère.
    private const string Elements =
        "datetime,tempmin,tempmax,precip,precipprob,windspeed,conditions,icon";

    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly WeatherOptions _options;
    private readonly ILogger<VisualCrossingWeatherClient> _logger;

    public VisualCrossingWeatherClient(
        HttpClient httpClient,
        IMemoryCache cache,
        IOptions<WeatherOptions> options,
        ILogger<VisualCrossingWeatherClient> logger)
    {
        _httpClient = httpClient;
        _cache = cache;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<IReadOnlyList<WeatherDay>> GetDailyAsync(
        decimal latitude,
        decimal longitude,
        DateOnly from,
        DateOnly to,
        CancellationToken cancellationToken = default)
    {
        // Culture invariante : « 34.76 » et non « 34,76 » (serveur en français).
        var location = string.Create(CultureInfo.InvariantCulture, $"{latitude},{longitude}");
        var cacheKey = $"weather:{location}:{from:yyyy-MM-dd}:{to:yyyy-MM-dd}";

        if (_cache.TryGetValue(cacheKey, out IReadOnlyList<WeatherDay>? cached) && cached is not null)
        {
            return cached;
        }

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            _logger.LogWarning("Clé Visual Crossing absente (Weather:ApiKey) : pas de météo.");
            return [];
        }

        var url =
            $"{_options.BaseUrl}{location}/{from:yyyy-MM-dd}/{to:yyyy-MM-dd}" +
            $"?unitGroup=metric&include=days&elements={Elements}&contentType=json&key={_options.ApiKey}";

        try
        {
            var response = await _httpClient.GetFromJsonAsync<TimelineResponse>(url, cancellationToken);

            var days = (response?.Days ?? [])
                .Select(day => new WeatherDay(
                    DateOnly.ParseExact(day.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture),
                    day.TempMin,
                    day.TempMax,
                    day.Precip,
                    day.PrecipProb,
                    day.WindSpeed,
                    day.Conditions,
                    day.Icon))
                .ToList();

            _cache.Set(cacheKey, (IReadOnlyList<WeatherDay>)days, TimeSpan.FromHours(_options.CacheHours));

            return days;
        }
        catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException)
        {
            // Service météo indisponible : pas de conseil, mais la planification continue.
            _logger.LogWarning(exception, "Visual Crossing indisponible pour {Location}.", location);
            return [];
        }
    }

    // Réponse Visual Crossing (seulement les champs demandés).
    private sealed class TimelineResponse
    {
        [JsonPropertyName("days")]
        public List<TimelineDay>? Days { get; set; }
    }

    private sealed class TimelineDay
    {
        [JsonPropertyName("datetime")] public string Date { get; set; } = string.Empty;
        [JsonPropertyName("tempmin")] public decimal? TempMin { get; set; }
        [JsonPropertyName("tempmax")] public decimal? TempMax { get; set; }
        [JsonPropertyName("precip")] public decimal? Precip { get; set; }
        [JsonPropertyName("precipprob")] public decimal? PrecipProb { get; set; }
        [JsonPropertyName("windspeed")] public decimal? WindSpeed { get; set; }
        [JsonPropertyName("conditions")] public string? Conditions { get; set; }
        [JsonPropertyName("icon")] public string? Icon { get; set; }
    }
}
