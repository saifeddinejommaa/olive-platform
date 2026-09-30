// Rendement d'un regroupement (variété, parcelle, fournisseur, mois).
export type YieldRow = {
  key: string;
  label: string;
  pressingsCount: number;
  oliveKg: number;
  // Huile attribuée (L), au prorata des kilos de chaque lot dans sa pression.
  oilLiters: number;
  // Litres d'huile pour 100 kg d'olives.
  litersPer100Kg: number;
  // Rendement en poids : kg d'huile pour 100 kg d'olives.
  yieldPercentage: number;
  // Pressions mélangeant plusieurs variétés : rendement moyenné.
  mixedPressingsCount: number;
};

// Rendements de la campagne (pressions terminées), calculés par l'API.
export type YieldIndicators = {
  totals: YieldRow;
  byVariety: YieldRow[];
  byPlot: YieldRow[];
  bySupplier: YieldRow[];
  // Clé « AAAA-MM », dans l'ordre chronologique.
  byMonth: YieldRow[];
};
