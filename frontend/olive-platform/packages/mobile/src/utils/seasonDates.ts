import { toDateOnlyString } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { harvestWindow } from "@olive-platform/core/features/seasons/domain/HarvestWindow";

type SeasonBounds = { startDate: string; endDate: string };

// Date par défaut d'un événement : aujourd'hui s'il est dans la campagne
// sélectionnée, sinon le premier jour de la campagne.
export function defaultDateInSeason(season?: SeasonBounds): Date {
  const today = toDateOnlyString(new Date());

  if (!season || (today >= season.startDate && today <= season.endDate)) {
    return new Date();
  }

  const [year, month, day] = season.startDate.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// Bornes de la campagne en Date locale (pour les sélecteurs de date).
export function seasonDateRange(season?: SeasonBounds) {
  if (!season) {
    return { minimumDate: undefined, maximumDate: undefined };
  }

  const toDate = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return {
    minimumDate: toDate(season.startDate),
    maximumDate: toDate(season.endDate),
  };
}

// Période de récolte de la campagne (1er septembre - 31 mars) : bornes du sélecteur.
export function harvestDateRange(season?: SeasonBounds) {
  return seasonDateRange(season ? harvestWindow(season) : undefined);
}

// Date de récolte par défaut : aujourd'hui s'il est dans la période de récolte,
// sinon son premier jour.
export function defaultHarvestDate(season?: SeasonBounds): Date {
  return defaultDateInSeason(season ? harvestWindow(season) : undefined);
}
