import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OliveAnalysisDetailsResponse = {
  id: number;

  reference: string;

  sourceTypeId: number;

  sourceReference: string;

  humidityPercentage?: number;

  waterPercentage?: number;

  oilPercentage?: number;

  acidityPercentage?: number;

  plannedDate?: string;

  startTime?: string;

  endTime?: string;

  varietyId: number;

  oliveVarOliveVarietyId: number;

  status: ProductionStatus;
};
