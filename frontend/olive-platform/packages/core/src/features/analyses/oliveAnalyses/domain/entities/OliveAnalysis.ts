import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OliveAnalysis = {
  id: number;
  sourceTypeId: number;
  sourceId: number;
  reference: string;

  humidityPercentage?: number;
  waterPercentage?: number;
  oilPercentage?: number;
  acidityPercentage?: number;

  analysisDate?: string;

  createdAt: string;
  updatedAt?: string;
  status: ProductionStatus;
};
