import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisSourceType } from "./OilAnalysisSourceType";

export interface OilAnalysisDetails {
  id: number;
  reference: string;
  sourceTypeId: OilAnalysisSourceType;
  sourceReference?: string;
  acidityPercentage?: number;
  peroxideIndex?: number;
  k232?: number;
  k270?: number;
  organolepticGrade?: number;
  analysisDate?: string;
  createdAt: string;
  updatedAt?: string;
  status: ProductionStatus;
}
