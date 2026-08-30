import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OliveAnalysisDetails = {
  id: number;

  reference: string;

  sourceTypeId: number;

  sourceReference: string;

  humidityPercentage?: number;

  waterPercentage?: number;

  oilPercentage?: number;

  acidityPercentage?: number;

  analysisDate?: string;

  createdAt: string;

  updatedAt: string;

  varietyId: number;

  status: ProductionStatus;
};
