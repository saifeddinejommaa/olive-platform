using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Weather;

/// <summary>
/// Conseil météo pour récolter une parcelle à une date : alertes (pluie,
/// gel, vent, chaleur) et jour conseillé. Un conseil, jamais une interdiction.
/// </summary>
public class GetHarvestWeatherAdviceQuery : IRequest<HarvestWeatherAdviceResponse>
{
    public int PlotId { get; set; }

    public DateOnly Date { get; set; }
}

public class HarvestWeatherAdviceResponse
{
    public int PlotId { get; set; }

    public string PlotReference { get; set; } = string.Empty;

    public string PlotName { get; set; } = string.Empty;

    public DateOnly Date { get; set; }

    // Prévision disponible pour cette date (parcelle géolocalisée, date proche).
    public bool ForecastAvailable { get; set; }

    // Météo du jour choisi (null si pas de prévision).
    public WeatherDay? Day { get; set; }

    // Pluie cumulée des 2 jours précédents (null si pas de prévision).
    public decimal? PreviousRainMm { get; set; }

    // ok, info, warning ou danger : le plus grave des conseils.
    public string Level { get; set; } = WeatherAdviceLevel.Ok;

    public List<WeatherWarning> Warnings { get; set; } = [];

    // Jour plus favorable proposé quand la date choisie pose problème.
    public DateOnly? SuggestedDate { get; set; }

    public WeatherDay? SuggestedDay { get; set; }
}

public class GetHarvestWeatherAdviceQueryHandler
    : IRequestHandler<GetHarvestWeatherAdviceQuery, HarvestWeatherAdviceResponse>
{
    private readonly IPlotRepository _plotRepository;
    private readonly IHarvestWeatherService _harvestWeatherService;

    public GetHarvestWeatherAdviceQueryHandler(
        IPlotRepository plotRepository,
        IHarvestWeatherService harvestWeatherService)
    {
        _plotRepository = plotRepository;
        _harvestWeatherService = harvestWeatherService;
    }

    public async Task<HarvestWeatherAdviceResponse> Handle(
        GetHarvestWeatherAdviceQuery request,
        CancellationToken cancellationToken)
    {
        var plot = await _plotRepository.GetByIdAsync(request.PlotId, cancellationToken)
            ?? throw new KeyNotFoundException($"Plot {request.PlotId} not found.");

        return await _harvestWeatherService.GetAdviceAsync(plot, request.Date, cancellationToken);
    }
}
