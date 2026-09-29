import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

// Types de citerne (table tank_type).
export const TankType = {
  Buffer: 1,
  Storage: 2,
} as const;

export type TankType = (typeof TankType)[keyof typeof TankType];

// Catégories d'huile (table oil_category).
export const OilCategory = {
  ExtraVirgin: 1,
  Virgin: 2,
  Lampante: 3,
  PendingAnalysis: 4,
} as const;

export type OilCategory = (typeof OilCategory)[keyof typeof OilCategory];

// Libellés courts des catégories commerciales (affichage des badges).
export const OIL_CATEGORY_LABELS: Record<OilCategory, string> = {
  [OilCategory.ExtraVirgin]: "Extra vierge",
  [OilCategory.Virgin]: "Vierge",
  [OilCategory.Lampante]: "Lampante",
  [OilCategory.PendingAnalysis]: "En attente d'analyse",
};

export type Tank = {
  id: number;
  code: string;
  name: string | null;
  capacityLiters: number;
  // Contenu actuel, calculé depuis les mouvements d'huile.
  currentQuantityLiters: number;
  availableCapacityLiters: number;
  fillPercentage: number;
  tankType: TankType;
  tankTypeLabel: string;
  oilCategory: OilCategory;
  oilCategoryLabel: string;
  status: string;
  // Tampon occupée : pression dont l'huile attend son analyse.
  pendingPressingNumber: string | null;
  // Analyse d'huile de cette pression : planifiée, en cours ou terminée.
  pendingOilAnalysisId: number | null;
  pendingOilAnalysisStatus: ProductionStatus | null;
  // Catégorie officielle de l'huile, fixée par l'API à la clôture de l'analyse.
  pendingOilCategory: OilCategory | null;
  pendingOilCategoryLabel: string | null;
};

export type TanksFilter = {
  code?: string;
  name?: string;
  tankType?: TankType;
  oilCategory?: OilCategory;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
};

export const isBufferTank = (tank: Tank) => tank.tankType === TankType.Buffer;
