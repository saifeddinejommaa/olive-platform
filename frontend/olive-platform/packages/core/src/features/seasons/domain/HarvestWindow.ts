type SeasonBounds = { startDate: string; endDate: string };

// Récolte des olives : du début de campagne (1er septembre) au 31 mars
// (même règle que SeasonCalendar côté API). Dates « AAAA-MM-JJ ».
export function harvestWindow(season: SeasonBounds): SeasonBounds {
  const endYear = Number(season.endDate.slice(0, 4));

  return {
    startDate: season.startDate,
    endDate: `${endYear}-03-31`,
  };
}
