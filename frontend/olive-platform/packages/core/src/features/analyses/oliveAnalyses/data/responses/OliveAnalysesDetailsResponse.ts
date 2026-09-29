import type { OliveAnalysisLot } from "../../domain/entities/OliveAnalysisLot";
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
  // Lots d'olives analysés.
  lots?: OliveAnalysisLot[];

  oliveVarOliveVarietyId: number;

  status: ProductionStatus;
};
