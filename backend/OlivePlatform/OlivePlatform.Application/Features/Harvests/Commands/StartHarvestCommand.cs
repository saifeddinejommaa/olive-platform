using System.Text.Json;
using MediatR;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Features.Weather;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.StartHarvest;

public class StartHarvestCommand : IRequest<Unit>
{
    public int Id { get; set; }

    // L'utilisateur a vu l'alerte météo et lance quand même.
    public bool WeatherAcknowledged { get; set; }
}

public class StartHarvestCommandHandler
    : IRequestHandler<StartHarvestCommand, Unit>
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly IHarvestRepository _repository;
    private readonly IPlotRepository _plotRepository;
    private readonly ISeasonService _seasonService;
    private readonly IHarvestWeatherService _harvestWeatherService;

    public StartHarvestCommandHandler(
        IHarvestRepository repository,
        IPlotRepository plotRepository,
        ISeasonService seasonService,
        IHarvestWeatherService harvestWeatherService)
    {
        _repository = repository;
        _plotRepository = plotRepository;
        _seasonService = seasonService;
        _harvestWeatherService = harvestWeatherService;
    }

    public async Task<Unit> Handle(
        StartHarvestCommand request,
        CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException(
                $"Harvest with id '{request.Id}' was not found.");
        }

        if (entity.Status != ProductionStatus.Planned)
        {
            throw new InvalidOperationException(
                "Seule une récolte planifiée peut être lancée.");
        }

        await _seasonService.EnsureSeasonOpenAsync(
            entity.SeasonId,
            cancellationToken);

        var now = DateTime.UtcNow;

        // Pas de lancement avant le jour prévu (on peut replanifier la date si besoin).
        var plannedDay = SeasonCalendar.ToBusinessDate(entity.PlannedDate);

        if (SeasonCalendar.ToBusinessDate(now) < plannedDay)
        {
            throw new BusinessException(
                $"La récolte est prévue le {plannedDay:dd/MM/yyyy} : elle ne peut pas être lancée avant cette date.");
        }

        // Météo réévaluée ici (pas celle envoyée par le front) : c'est elle qui est enregistrée.
        var plot = await _plotRepository.GetByIdAsync(entity.PlotId, cancellationToken)
            ?? throw new KeyNotFoundException($"Plot {entity.PlotId} not found.");

        var advice = await _harvestWeatherService.GetAdviceAsync(
            plot,
            SeasonCalendar.ToBusinessDate(now),
            cancellationToken);

        var unfavorable = WeatherAdviceLevel.Rank(advice.Level)
            >= WeatherAdviceLevel.Rank(WeatherAdviceLevel.Warning);

        await _repository.AddStartWeatherAsync(
            new HarvestStartWeather
            {
                HarvestId = entity.Id,
                CheckedAt = now,
                WeatherDate = advice.Date,
                TempMin = advice.Day?.TempMin,
                TempMax = advice.Day?.TempMax,
                PrecipitationMm = advice.Day?.PrecipitationMm,
                PrecipitationProbability = advice.Day?.PrecipitationProbability,
                WindSpeedKmh = advice.Day?.WindSpeedKmh,
                PreviousRainMm = advice.PreviousRainMm,
                Conditions = advice.Day?.Conditions,
                Level = advice.Level,
                Warnings = JsonSerializer.Serialize(advice.Warnings, JsonOptions),
                StartedDespiteWarning = unfavorable && request.WeatherAcknowledged,
            },
            cancellationToken);

        entity.Status = ProductionStatus.InProgress;
        entity.StartTime = now;
        entity.UpdatedAt = now;

        // Un seul SaveChanges : récolte lancée et météo enregistrées ensemble.
        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return Unit.Value;
    }
}