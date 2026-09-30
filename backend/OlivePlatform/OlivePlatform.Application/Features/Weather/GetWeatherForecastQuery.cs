using MediatR;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Weather;

/// <summary>
/// Prévisions météo d'une parcelle : aujourd'hui et les jours suivants.
/// Sans parcelle précisée : la première parcelle géolocalisée.
/// </summary>
public class GetWeatherForecastQuery : IRequest<WeatherForecastResponse>
{
    public int? PlotId { get; set; }
}

public class WeatherForecastResponse
{
    public int PlotId { get; set; }

    public string PlotReference { get; set; } = string.Empty;

    public string PlotName { get; set; } = string.Empty;

    // Aujourd'hui en premier, puis les jours suivants.
    public IReadOnlyList<WeatherDay> Days { get; set; } = [];
}

public class GetWeatherForecastQueryHandler
    : IRequestHandler<GetWeatherForecastQuery, WeatherForecastResponse>
{
    // Aujourd'hui + 6 jours.
    private const int ForecastDays = 7;

    private readonly IPlotRepository _plotRepository;
    private readonly IWeatherClient _weatherClient;

    public GetWeatherForecastQueryHandler(
        IPlotRepository plotRepository,
        IWeatherClient weatherClient)
    {
        _plotRepository = plotRepository;
        _weatherClient = weatherClient;
    }

    public async Task<WeatherForecastResponse> Handle(
        GetWeatherForecastQuery request,
        CancellationToken cancellationToken)
    {
        var plot = await GetPlotAsync(request.PlotId, cancellationToken);

        var today = SeasonCalendar.ToBusinessDate(DateTime.UtcNow);

        var days = await _weatherClient.GetDailyAsync(
            plot.Latitude!.Value,
            plot.Longitude!.Value,
            today,
            today.AddDays(ForecastDays - 1),
            cancellationToken);

        return new WeatherForecastResponse
        {
            PlotId = plot.Id,
            PlotReference = plot.Reference,
            PlotName = plot.Name,
            Days = days,
        };
    }

    private async Task<Plot> GetPlotAsync(int? plotId, CancellationToken cancellationToken)
    {
        if (plotId is null)
        {
            return await _plotRepository.GetFirstGeolocatedAsync(cancellationToken)
                ?? throw new BusinessException(
                    "Aucune parcelle n'a de coordonnées GPS : renseignez-les pour afficher la météo.");
        }

        var plot = await _plotRepository.GetByIdAsync(plotId.Value, cancellationToken)
            ?? throw new KeyNotFoundException($"Plot {plotId} not found.");

        if (plot.Latitude is null || plot.Longitude is null)
        {
            throw new BusinessException(
                $"La parcelle {plot.Reference} n'a pas de coordonnées GPS : renseignez-les pour afficher la météo.");
        }

        return plot;
    }
}
