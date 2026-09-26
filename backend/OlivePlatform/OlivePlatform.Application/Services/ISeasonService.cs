using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Services;

public interface ISeasonService
{
    // Campagne contenant la date ; créée automatiquement si elle n'existe pas encore.
    Task<Season> GetOrCreateForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default);

    // Campagne d'un nouvel événement :
    // - seasonId fourni (campagne sélectionnée) : vérifie qu'elle est ouverte et contient la date ;
    // - sinon : déduite de la date.
    Task<int> ResolveForDateAsync(
        int? seasonId,
        DateOnly date,
        CancellationToken cancellationToken = default);

    // Campagne d'un événement rattaché à une source (récolte, achat, pression) :
    // hérite de la campagne de la source et vérifie la date éventuelle.
    Task<int> ResolveFromSourceAsync(
        int sourceSeasonId,
        int? seasonId,
        DateOnly? date,
        CancellationToken cancellationToken = default);

    Task<int> GetSeasonIdOfSourceAsync(
        InputSourceType sourceType,
        int sourceId,
        CancellationToken cancellationToken = default);

    // Vérifie que toutes les sources (entrées d'une pression) appartiennent à la campagne.
    Task EnsureSourcesInSeasonAsync(
        int seasonId,
        IEnumerable<(InputSourceType SourceType, int SourceId)> sources,
        CancellationToken cancellationToken = default);

    Task EnsureDateInSeasonAsync(
        int seasonId,
        DateOnly date,
        CancellationToken cancellationToken = default);

    Task EnsureSeasonOpenAsync(
        int seasonId,
        CancellationToken cancellationToken = default);

    // Crée la campagne en cours et la suivante si elles n'existent pas.
    Task EnsureCurrentSeasonsAsync(
        CancellationToken cancellationToken = default);
}
