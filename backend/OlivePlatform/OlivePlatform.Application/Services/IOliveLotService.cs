using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Application.Services;

// Réservation / libération / consommation des lots d'olives par les pressions.
public interface IOliveLotService
{
    // Vérifie et réserve les lots des entrées (campagne, disponibilité, analyse)
    // puis décrémente leur restant. Retourne la quantité retenue par lot.
    Task<Dictionary<long, decimal>> ReserveAsync(
        int seasonId,
        IReadOnlyCollection<NewPressingOperationInputRequest> inputs,
        CancellationToken cancellationToken = default);

    // Rend aux lots les quantités des entrées encore réservées.
    Task ReleaseAsync(
        IEnumerable<PressingOperationInput> inputs,
        CancellationToken cancellationToken = default);

    // Pression terminée : les lots entièrement pressés sont vidés.
    Task CompleteAsync(
        IEnumerable<PressingOperationInput> inputs,
        CancellationToken cancellationToken = default);

    // Huile attendue (litres) d'après le % d'huile de l'analyse de chaque lot.
    Task<decimal?> CalculateExpectedOilLitersAsync(
        IReadOnlyDictionary<long, decimal> quantitiesByLot,
        CancellationToken cancellationToken = default);

    // Vérifie que chaque lot est analysé (analyse terminée) ou dispensé d'analyse.
    Task EnsureLotsAnalysedAsync(
        IEnumerable<long> lotIds,
        CancellationToken cancellationToken = default);

    // Le lot sera pressé sans analyse.
    Task SkipAnalysisAsync(
        long lotId,
        CancellationToken cancellationToken = default);
}
