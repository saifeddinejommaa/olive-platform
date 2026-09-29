import { classifyOil, type OilGrade } from "../../oilQuality/OilGrade";
import { ProductionStatus } from "../../production/domain/entities/ProductionStatus";
import { OilCategory, TankType, type Tank } from "./entities/Tank";
import type { TankContent } from "./entities/TankDetails";

// Catégorie d'huile d'une citerne de stockage, au format OilGrade.
const CATEGORY_GRADES: Partial<Record<OilCategory, OilGrade>> = {
  [OilCategory.ExtraVirgin]: "extraVirgin",
  [OilCategory.Virgin]: "virgin",
  [OilCategory.Lampante]: "lampante",
};

export type OilType = {
  // null : en attente d'analyse.
  grade: OilGrade | null;
  // D'où vient la catégorie : l'analyse terminée ou la citerne de stockage.
  source: "analysis" | "tank" | "pending";
};

/**
 * Type de l'huile d'un lot : résultat de son analyse terminée, sinon la
 * catégorie de la citerne de stockage ; en tampon, en attente d'analyse.
 */
export function oilTypeOf(tank: Tank, content: TankContent): OilType {
  if (content.oilAnalysisStatus === ProductionStatus.Completed) {
    const grade = classifyOil({
      acidity: content.acidityPercentage,
      peroxide: content.peroxideIndex,
      k232: content.k232,
      k270: content.k270,
    });

    if (grade) return { grade, source: "analysis" };
  }

  if (tank.tankType === TankType.Storage) {
    return { grade: CATEGORY_GRADES[tank.oilCategory] ?? null, source: "tank" };
  }

  return { grade: null, source: "pending" };
}

// Catégorie d'une citerne au format OilGrade (null pour une tampon).
export const tankGrade = (tank: Tank): OilGrade | null =>
  CATEGORY_GRADES[tank.oilCategory] ?? null;

// Catégorie de citerne correspondant à une catégorie d'huile.
export const GRADE_CATEGORIES: Record<OilGrade, OilCategory> = {
  extraVirgin: OilCategory.ExtraVirgin,
  virgin: OilCategory.Virgin,
  lampante: OilCategory.Lampante,
};

// État de l'huile d'une citerne tampon, d'après l'analyse de sa pression.
export type BufferOilState =
  | { kind: "empty" }
  | { kind: "pending"; label: string }
  // Analyse terminée : catégorie connue, l'huile attend son transfert.
  | { kind: "analysed"; grade: OilGrade | null };

export function bufferOilState(tank: Tank): BufferOilState {
  if (Number(tank.currentQuantityLiters) <= 0) return { kind: "empty" };

  switch (tank.pendingOilAnalysisStatus) {
    case ProductionStatus.Completed:
      return {
        kind: "analysed",
        grade: classifyOil({
          acidity: tank.pendingAcidityPercentage,
          peroxide: tank.pendingPeroxideIndex,
          k232: tank.pendingK232,
          k270: tank.pendingK270,
        }),
      };
    case ProductionStatus.InProgress:
      return { kind: "pending", label: "Analyse en cours" };
    case ProductionStatus.Planned:
      return { kind: "pending", label: "Analyse planifiée" };
    default:
      return { kind: "pending", label: "En attente d'analyse" };
  }
}
