import type { OilCategory } from "../../../../tanks/domain/entities/Tank";
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisSourceType } from "../../domain/entities/OilAnalysisSourceType";

export type OilAnalysisForListResponse = {
  id: number;
  reference: string;
  sourceTypeId: OilAnalysisSourceType;
  sourceReference: string | null;
  // Citernes contenant l'huile analysée (codes séparés par des virgules).
  oilLocation: string | null;
  plannedDate: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  status: ProductionStatus;
  // Résultats (null tant qu'ils ne sont pas saisis).
  acidityPercentage: number | null;
  peroxideIndex: number | null;
  k232: number | null;
  k270: number | null;
  // Catégorie officielle, fixée à la clôture.
  oilCategory: OilCategory | null;
};
