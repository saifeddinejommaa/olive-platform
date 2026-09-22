import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisSourceType } from "../../domain/entities/OilAnalysisSourceType";

export type OilAnalysisDetailsResponse = {
  id: number;

  reference: string;

  sourceTypeId: OilAnalysisSourceType;

  sourceId: number;

  sourceReference: string | null;

  acidityPercentage: number | null;

  peroxideIndex: number | null;

  k232: number | null;

  k270: number | null;

  organolepticGrade: number | null;

  analysisDate: string | undefined;

  createdAt: string;

  updatedAt: string | null;

  status: ProductionStatus;
};
