using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Services;

public class SeasonService : ISeasonService
{
    private readonly ISeasonRepository _repository;
    private readonly IHarvestRepository _harvestRepository;
    private readonly IOlivePurchaseRepository _purchaseRepository;
    private readonly IOlivePurchaseItemRepository _purchaseItemRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SeasonService(
        ISeasonRepository repository,
        IHarvestRepository harvestRepository,
        IOlivePurchaseRepository purchaseRepository,
        IOlivePurchaseItemRepository purchaseItemRepository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _harvestRepository = harvestRepository;
        _purchaseRepository = purchaseRepository;
        _purchaseItemRepository = purchaseItemRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Season> GetOrCreateForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByDateAsync(date, cancellationToken);

        if (existing is not null)
        {
            return existing;
        }

        var startYear = SeasonCalendar.GetStartYear(date);
        var now = DateTime.UtcNow;

        var season = new Season
        {
            Label = SeasonCalendar.GetLabel(startYear),
            StartDate = SeasonCalendar.GetStartDate(startYear),
            EndDate = SeasonCalendar.GetEndDate(startYear),
            Status = SeasonStatus.Open,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _repository.AddAsync(season, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return season;
    }

    public async Task<int> ResolveForDateAsync(
        int? seasonId,
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        if (seasonId.HasValue)
        {
            await EnsureDateInSeasonAsync(seasonId.Value, date, cancellationToken);

            return seasonId.Value;
        }

        var season = await GetOrCreateForDateAsync(date, cancellationToken);

        EnsureOpen(season);

        return season.Id;
    }

    public async Task<int> ResolveFromSourceAsync(
        int sourceSeasonId,
        int? seasonId,
        DateOnly? date,
        CancellationToken cancellationToken = default)
    {
        if (seasonId.HasValue && seasonId.Value != sourceSeasonId)
        {
            throw new BusinessException(
                "La source sélectionnée n'appartient pas à la campagne sélectionnée.");
        }

        if (date.HasValue)
        {
            await EnsureDateInSeasonAsync(sourceSeasonId, date.Value, cancellationToken);
        }
        else
        {
            await EnsureSeasonOpenAsync(sourceSeasonId, cancellationToken);
        }

        return sourceSeasonId;
    }

    public async Task<int> GetSeasonIdOfSourceAsync(
        InputSourceType sourceType,
        int sourceId,
        CancellationToken cancellationToken = default)
    {
        if (sourceType == InputSourceType.Harvest)
        {
            var harvest = await _harvestRepository.GetByIdAsync(sourceId, cancellationToken)
                ?? throw new KeyNotFoundException(
                    $"Harvest with id '{sourceId}' was not found.");

            return harvest.SeasonId;
        }

        var item = await _purchaseItemRepository.GetByIdAsync(sourceId, cancellationToken)
            ?? throw new KeyNotFoundException(
                $"Purchase item with id '{sourceId}' was not found.");

        var purchase = await _purchaseRepository.GetByIdAsync(item.PurchaseId, cancellationToken)
            ?? throw new KeyNotFoundException(
                $"Purchase with id '{item.PurchaseId}' was not found.");

        return purchase.SeasonId;
    }

    public async Task EnsureSourcesInSeasonAsync(
        int seasonId,
        IEnumerable<(InputSourceType SourceType, int SourceId)> sources,
        CancellationToken cancellationToken = default)
    {
        foreach (var (sourceType, sourceId) in sources.Distinct())
        {
            var sourceSeasonId = await GetSeasonIdOfSourceAsync(
                sourceType,
                sourceId,
                cancellationToken);

            if (sourceSeasonId != seasonId)
            {
                throw new BusinessException(
                    "Toutes les entrées doivent appartenir à la même campagne que l'opération de pression.");
            }
        }
    }

    public async Task EnsureDateInSeasonAsync(
        int seasonId,
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        var season = await GetSeasonAsync(seasonId, cancellationToken);

        EnsureOpen(season);

        if (date < season.StartDate || date > season.EndDate)
        {
            throw new BusinessException(
                $"La date doit être comprise dans la campagne {season.Label} " +
                $"({season.StartDate:dd/MM/yyyy} – {season.EndDate:dd/MM/yyyy}).");
        }
    }

    public async Task EnsureSeasonOpenAsync(
        int seasonId,
        CancellationToken cancellationToken = default)
    {
        var season = await GetSeasonAsync(seasonId, cancellationToken);

        EnsureOpen(season);
    }

    public async Task EnsureCurrentSeasonsAsync(
        CancellationToken cancellationToken = default)
    {
        var today = SeasonCalendar.ToBusinessDate(DateTime.UtcNow);
        var startYear = SeasonCalendar.GetStartYear(today);

        await GetOrCreateForDateAsync(
            SeasonCalendar.GetStartDate(startYear),
            cancellationToken);

        await GetOrCreateForDateAsync(
            SeasonCalendar.GetStartDate(startYear + 1),
            cancellationToken);
    }

    private async Task<Season> GetSeasonAsync(
        int seasonId,
        CancellationToken cancellationToken)
    {
        return await _repository.GetByIdAsync(seasonId, cancellationToken)
            ?? throw new BusinessException("La campagne sélectionnée n'existe pas.");
    }

    private static void EnsureOpen(Season season)
    {
        if (season.Status == SeasonStatus.Closed)
        {
            throw new BusinessException(
                $"La campagne {season.Label} est clôturée : aucune modification n'est possible.");
        }
    }
}
