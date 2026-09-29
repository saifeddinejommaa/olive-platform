import { ProductionStatus } from "../../production/domain/entities/ProductionStatus";
import { OilCategory, TankType, type Tank } from "./entities/Tank";
import type { TankContent } from "./entities/TankDetails";

/*
 * La catégorie d'une huile n'est jamais calculée ici : l'API la fixe à la
 * clôture de l'analyse (oil_analyses.oil_category_id) et l'écran la lit.
 */

export type OilType = {
  // null : en attente d'analyse.
  category: OilCategory | null;
  // D'où vient la catégorie : l'analyse terminée ou la citerne de stockage.
  source: "analysis" | "tank" | "pending";
};

// Catégorie commerciale d'une citerne (null pour une tampon).
export const tankCategory = (tank: Tank): OilCategory | null =>
  tank.oilCategory === OilCategory.PendingAnalysis ? null : tank.oilCategory;

/**
 * Type de l'huile d'un lot : catégorie de son analyse terminée, sinon celle
 * de la citerne de stockage ; en tampon, en attente d'analyse.
 */
export function oilTypeOf(tank: Tank, content: TankContent): OilType {
  if (content.oilAnalysisCategory !== null) {
    return { category: content.oilAnalysisCategory, source: "analysis" };
  }

  if (tank.tankType === TankType.Storage) {
    return { category: tankCategory(tank), source: "tank" };
  }

  return { category: null, source: "pending" };
}

// État de l'huile d'une citerne tampon, d'après l'analyse de sa pression.
export type BufferOilState =
  | { kind: "empty" }
  | { kind: "pending"; label: string }
  // Analyse terminée : catégorie connue, l'huile attend son transfert.
  | { kind: "analysed"; category: OilCategory | null };

export function bufferOilState(tank: Tank): BufferOilState {
  if (Number(tank.currentQuantityLiters) <= 0) return { kind: "empty" };

  switch (tank.pendingOilAnalysisStatus) {
    case ProductionStatus.Completed:
      return { kind: "analysed", category: tank.pendingOilCategory };
    case ProductionStatus.InProgress:
      return { kind: "pending", label: "Analyse en cours" };
    case ProductionStatus.Planned:
      return { kind: "pending", label: "Analyse planifiée" };
    default:
      return { kind: "pending", label: "En attente d'analyse" };
  }
}
