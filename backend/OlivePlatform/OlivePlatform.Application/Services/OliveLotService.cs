using OlivePlatform.Application.Common;
using OlivePlatform.Domain;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Services;

public class OliveLotService : IOliveLotService
{
    private const decimal OliveOilDensityKgPerLiter = 0.916m;

    private readonly IOliveLotRepository _lotRepository;
    private readonly IOliveAnalysisRepository _analysisRepository;

    public OliveLotService(
        IOliveLotRepository lotRepository,
        IOliveAnalysisRepository analysisRepository)
    {
        _lotRepository = lotRepository;
        _analysisRepository = analysisRepository;
    }

    public async Task<Dictionary<long, decimal>> ReserveAsync(
        int seasonId,
        IReadOnlyCollection<NewPressingOperationInputRequest> inputs,
        CancellationToken cancellationToken = default)
    {
        if (inputs.Count == 0)
        {
            throw new BusinessException("Sélectionnez au moins un lot d'olives.");
        }

        var lots = (await _lotRepository.GetByIdsAsync(
                inputs.Select(input => input.LotId),
                cancellationToken))
            .ToDictionary(lot => lot.Id);

        var quantities = new Dictionary<long, decimal>();

        foreach (var input in inputs)
        {
            if (!lots.TryGetValue(input.LotId, out var lot))
            {
                throw new KeyNotFoundException(
                    $"Olive lot with id '{input.LotId}' was not found.");
            }

            if (lot.SeasonId != seasonId)
            {
                throw new BusinessException(
                    $"Le lot {lot.Reference} n'appartient pas à la campagne de l'opération de pression.");
            }

            if (!lot.IsPressable)
            {
                throw new BusinessException(
                    $"Le lot {lot.Reference} n'est plus disponible.");
            }

            await EnsureAnalysedAsync(lot, cancellationToken);

            // Sans quantité précisée, tout le restant du lot est pressé.
            var quantity = input.QuantityKg is > 0
                ? input.QuantityKg.Value
                : lot.RemainingKg;

            if (quantity > lot.RemainingKg)
            {
                throw new BusinessException(
                    $"Le lot {lot.Reference} ne contient plus que {lot.RemainingKg:0.##} kg.");
            }

            lot.RemainingKg -= quantity;
            lot.RefreshStatus();
            lot.UpdatedAt = DateTime.UtcNow;

            quantities[lot.Id] = quantities.GetValueOrDefault(lot.Id) + quantity;
        }

        await _lotRepository.SaveChangesAsync(cancellationToken);

        return quantities;
    }

    public async Task ReleaseAsync(
        IEnumerable<PressingOperationInput> inputs,
        CancellationToken cancellationToken = default)
    {
        var reserved = inputs
            .Where(input => input.Status == PressingOperationInputStatus.Reserved)
            .ToList();

        if (reserved.Count == 0)
        {
            return;
        }

        var lots = (await _lotRepository.GetByIdsAsync(
                reserved.Select(input => input.LotId),
                cancellationToken))
            .ToDictionary(lot => lot.Id);

        foreach (var input in reserved)
        {
            if (!lots.TryGetValue(input.LotId, out var lot))
            {
                continue;
            }

            lot.RemainingKg = Math.Min(lot.QuantityKg, lot.RemainingKg + input.QuantityKg);
            lot.RefreshStatus();
            lot.UpdatedAt = DateTime.UtcNow;
        }

        await _lotRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task CompleteAsync(
        IEnumerable<PressingOperationInput> inputs,
        CancellationToken cancellationToken = default)
    {
        var lots = await _lotRepository.GetByIdsAsync(
            inputs.Select(input => input.LotId),
            cancellationToken);

        foreach (var lot in lots)
        {
            if (lot.RemainingKg <= 0 && lot.Status != OliveLotStatus.Closed)
            {
                lot.Status = OliveLotStatus.Empty;
            }
            else
            {
                lot.RefreshStatus();
            }

            lot.UpdatedAt = DateTime.UtcNow;
        }

        await _lotRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task<decimal?> CalculateExpectedOilLitersAsync(
        IReadOnlyDictionary<long, decimal> quantitiesByLot,
        CancellationToken cancellationToken = default)
    {
        var lots = await _lotRepository.GetByIdsAsync(
            quantitiesByLot.Keys,
            cancellationToken);

        var oilPercentages = new Dictionary<int, decimal?>();
        decimal expectedOilKg = 0;
        var hasAnyAnalysis = false;

        foreach (var lot in lots)
        {
            if (lot.OliveAnalysisId is not int analysisId)
            {
                continue;
            }

            if (!oilPercentages.TryGetValue(analysisId, out var oilPercentage))
            {
                var analysis = await _analysisRepository.GetByIdAsync(analysisId, cancellationToken);
                oilPercentage = analysis?.OilPercentage;
                oilPercentages[analysisId] = oilPercentage;
            }

            if (oilPercentage is null)
            {
                continue;
            }

            expectedOilKg += quantitiesByLot[lot.Id] * (oilPercentage.Value / 100m);
            hasAnyAnalysis = true;
        }

        return hasAnyAnalysis
            ? expectedOilKg / OliveOilDensityKgPerLiter
            : null;
    }

    public async Task EnsureLotsAnalysedAsync(
        IEnumerable<long> lotIds,
        CancellationToken cancellationToken = default)
    {
        var lots = await _lotRepository.GetByIdsAsync(lotIds, cancellationToken);

        foreach (var lot in lots)
        {
            await EnsureAnalysedAsync(lot, cancellationToken);
        }
    }

    public async Task SkipAnalysisAsync(
        long lotId,
        CancellationToken cancellationToken = default)
    {
        var lot = await _lotRepository.GetByIdAsync(lotId, cancellationToken)
            ?? throw new KeyNotFoundException(
                $"Olive lot with id '{lotId}' was not found.");

        if (!lot.NeedAnalysis)
        {
            return;
        }

        lot.NeedAnalysis = false;
        lot.UpdatedAt = DateTime.UtcNow;

        await _lotRepository.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureAnalysedAsync(
        OliveLot lot,
        CancellationToken cancellationToken)
    {
        if (!lot.NeedAnalysis)
        {
            return;
        }

        var analysis = lot.OliveAnalysisId is int analysisId
            ? await _analysisRepository.GetByIdAsync(analysisId, cancellationToken)
            : null;

        if (analysis?.Status != ProductionStatus.Completed)
        {
            throw new BusinessException(
                $"Le lot {lot.Reference} est en attente d'analyse : terminez l'analyse ou passez-le sans analyse.");
        }
    }
}
