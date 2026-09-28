import { toDateOnlyString } from "../../shared/utils/DatesUtils";
import type { OliveLot } from "./entities/OliveLot";

// Pression proposée : les lots pressables d'une même source et d'une même variété
// (jamais de mélange de sources).
export type ProposedPressing = {
  key: string;
  sourceType: number;
  sourceId: number;
  sourceReference: string;
  varietyId: number | null;
  lots: OliveLot[];
  totalKg: number;
  // Date du lot le plus ancien : sert à presser les olives les plus anciennes d'abord.
  oldestLotDate: string;
};

// Regroupe les lots pressables par source + variété, du plus ancien au plus récent.
export function buildProposedPressings(lots: OliveLot[]): ProposedPressing[] {
  const groups = new Map<string, ProposedPressing>();

  for (const lot of lots) {
    if (!lot.isPressable || lot.remainingKg <= 0) continue;

    const sourceId = lot.sourceType === 1 ? lot.harvestId : lot.purchaseId;
    if (sourceId == null) continue;

    const key = `${lot.sourceType}-${sourceId}-${lot.varietyId ?? 0}`;
    const group = groups.get(key);

    if (group) {
      group.lots.push(lot);
      group.totalKg += lot.remainingKg;
      if (lot.createdAt < group.oldestLotDate) group.oldestLotDate = lot.createdAt;
    } else {
      groups.set(key, {
        key,
        sourceType: lot.sourceType,
        sourceId,
        sourceReference: lot.sourceReference ?? "",
        varietyId: lot.varietyId,
        lots: [lot],
        totalKg: lot.remainingKg,
        oldestLotDate: lot.createdAt,
      });
    }
  }

  return [...groups.values()].sort((a, b) =>
    a.oldestLotDate.localeCompare(b.oldestLotDate),
  );
}

const parseDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (value: string, days: number) => {
  const date = parseDateOnly(value);
  date.setDate(date.getDate() + days);
  return toDateOnlyString(date);
};

// Répartit les pressions sur les jours à partir de startDate, sans dépasser
// la capacité journalière du moulin. Une pression plus grosse que la capacité
// occupe plusieurs jours. Les dates saisies à la main (overrides) sont gardées
// et ne consomment pas de capacité.
export function schedulePressings(
  pressings: ProposedPressing[],
  startDate: string,
  capacityKgPerDay: number,
  overrides: Record<string, string> = {},
): Record<string, string> {
  const dates: Record<string, string> = {};
  const capacity = capacityKgPerDay > 0 ? capacityKgPerDay : Number.POSITIVE_INFINITY;

  let day = startDate;
  let dayLoad = 0;

  for (const pressing of pressings) {
    const override = overrides[pressing.key];

    if (override) {
      dates[pressing.key] = override;
      continue;
    }

    // Ne rentre pas dans le reste de la journée : on passe au jour suivant.
    if (dayLoad > 0 && dayLoad + pressing.totalKg > capacity) {
      day = addDays(day, 1);
      dayLoad = 0;
    }

    dates[pressing.key] = day;
    dayLoad += pressing.totalKg;

    // Journée(s) pleine(s) : le jour suivant démarre après.
    if (dayLoad >= capacity) {
      const fullDays = Math.floor(dayLoad / capacity);
      day = addDays(day, fullDays);
      dayLoad = dayLoad - fullDays * capacity;
    }
  }

  return dates;
}
