using MediatR;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Weather;

/// <summary>
/// Météo du jour pour lancer une récolte : le front l'affiche avant le
/// lancement et demande confirmation si elle est défavorable.
/// </summary>
public class GetHarvestStartCheckQuery : IRequest<HarvestWeatherAdviceResponse>
{
    public int HarvestId { get; set; }
}

public class GetHarvestStartCheckQueryHandler
    : IRequestHandler<GetHarvestStartCheckQuery, HarvestWeatherAdviceResponse>
{
    private readonly IHarvestRepository _harvestRepository;
    private readonly IPlotRepository _plotRepository;
    private readonly IHarvestWeatherService _harvestWeatherService;

    public GetHarvestStartCheckQueryHandler(
        IHarvestRepository harvestRepository,
        IPlotRepository plotRepository,
        IHarvestWeatherService harvestWeatherService)
    {
        _harvestRepository = harvestRepository;
        _plotRepository = plotRepository;
        _harvestWeatherService = harvestWeatherService;
    }

    public async Task<HarvestWeatherAdviceResponse> Handle(
        GetHarvestStartCheckQuery request,
        CancellationToken cancellationToken)
    {
        var harvest = await _harvestRepository.GetByIdAsync(request.HarvestId, cancellationToken)
            ?? throw new KeyNotFoundException($"Harvest {request.HarvestId} not found.");

        var plot = await _plotRepository.GetByIdAsync(harvest.PlotId, cancellationToken)
            ?? throw new KeyNotFoundException($"Plot {harvest.PlotId} not found.");

        return await _harvestWeatherService.GetAdviceAsync(
            plot,
            SeasonCalendar.ToBusinessDate(DateTime.UtcNow),
            cancellationToken);
    }
}
