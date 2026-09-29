import type { OliveAnalysisLot } from "./OliveAnalysisLot";
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

  plannedDate?: string;

  startTime?: string;

  endTime?: string;

  varietyId: number;
  // Lots analysés : quantité totale (kg) et nombre.
  quantityKg?: number;
  lotsCount?: number;
  // Lots d'olives analysés.
  lots?: OliveAnalysisLot[];

  status: ProductionStatus;
};
