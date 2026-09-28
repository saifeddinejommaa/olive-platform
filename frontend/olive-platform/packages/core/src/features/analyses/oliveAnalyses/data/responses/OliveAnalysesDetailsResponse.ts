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

  // Lots analysés : quantité totale (kg) et nombre.
  quantityKg?: number;

  lotsCount?: number;

  oliveVarOliveVarietyId: number;

  status: ProductionStatus;
};
