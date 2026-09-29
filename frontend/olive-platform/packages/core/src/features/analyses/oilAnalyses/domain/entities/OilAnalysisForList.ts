import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisSourceType } from "./OilAnalysisSourceType";

export type OilAnalysisForList = {
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
};
