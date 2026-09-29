import type { OilCategory } from "../../../../tanks/domain/entities/Tank";
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisSourceType } from "../../domain/entities/OilAnalysisSourceType";
import type { OilLocation } from "../../domain/entities/OilLocation";

export type OilAnalysisDetailsResponse = {
  id: number;

  reference: string;

  sourceTypeId: OilAnalysisSourceType;

  sourceId: number;

  // Huile produite par la pression source (L).
  oilQuantityLiters: number | null;

  // Où se trouve l'huile analysée aujourd'hui.
  oilLocations: OilLocation[] | null;

  sourceReference: string | null;

  acidityPercentage: number | null;

  peroxideIndex: number | null;

  k232: number | null;

  k270: number | null;

  organolepticGrade: number | null;

  plannedDate: string | undefined;

  startTime: string | null;

  endTime: string | null;

  createdAt: string;

  updatedAt: string | null;

  status: ProductionStatus;

  // Catégorie officielle, fixée par l'API à la clôture (null avant).
  oilCategory: OilCategory | null;

  oilCategoryLabel: string | null;
};
