/**
 * Catégorie commerciale d'une huile d'olive (normes COI), déterminée à
 * partir de l'analyse d'huile. Un critère non mesuré n'est pas vérifié ;
 * un seul critère dépassé suffit à déclasser l'huile.
 */
export type OilGrade = "extraVirgin" | "virgin" | "lampante";

export const OIL_GRADE_LABELS: Record<OilGrade, string> = {
  extraVirgin: "Extra vierge",
  virgin: "Vierge",
  lampante: "Lampante",
};

// Seuils COI par catégorie (au-delà de « vierge » : lampante).
export const OIL_GRADE_LIMITS = {
  extraVirgin: { acidity: 0.8, peroxide: 20, k232: 2.5, k270: 0.22 },
  virgin: { acidity: 2.0, peroxide: 20, k232: 2.6, k270: 0.25 },
} as const;

export type OilTestResults = {
  // Acidité libre (% acide oléique), indispensable au classement.
  acidity: number | null | undefined;
  // Indice de peroxyde (meq O₂/kg).
  peroxide?: number | null;
  k232?: number | null;
  k270?: number | null;
};

const withinLimits = (
  results: OilTestResults,
  limits: { acidity: number; peroxide: number; k232: number; k270: number },
) =>
  (results.acidity as number) <= limits.acidity &&
  (results.peroxide == null || results.peroxide <= limits.peroxide) &&
  (results.k232 == null || results.k232 <= limits.k232) &&
  (results.k270 == null || results.k270 <= limits.k270);

// Catégorie de l'huile ; null tant que l'acidité n'est pas connue.
export function classifyOil(results: OilTestResults): OilGrade | null {
  const { acidity } = results;

  if (acidity == null || Number.isNaN(acidity) || acidity < 0) return null;

  if (withinLimits(results, OIL_GRADE_LIMITS.extraVirgin)) return "extraVirgin";
  if (withinLimits(results, OIL_GRADE_LIMITS.virgin)) return "virgin";

  return "lampante";
}
