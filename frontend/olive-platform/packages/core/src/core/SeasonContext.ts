/**
 * Campagne sélectionnée par l'utilisateur.
 * Le store des campagnes enregistre ici un fournisseur ; le HttpClient l'utilise
 * pour ajouter automatiquement `seasonId` à chaque appel d'API.
 */

type SeasonIdProvider = () => number | null;

let seasonIdProvider: SeasonIdProvider = () => null;

export function setSeasonIdProvider(provider: SeasonIdProvider) {
  seasonIdProvider = provider;
}

export function getSelectedSeasonId(): number | null {
  return seasonIdProvider();
}
