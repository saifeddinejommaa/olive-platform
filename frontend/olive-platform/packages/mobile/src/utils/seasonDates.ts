import { toDateOnlyString } from "@olive-platform/core/features/shared/utils/DatesUtils";

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
