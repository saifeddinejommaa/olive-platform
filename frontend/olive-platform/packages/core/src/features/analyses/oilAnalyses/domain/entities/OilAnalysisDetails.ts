import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisSourceType } from "./OilAnalysisSourceType";
import type { OilLocation } from "./OilLocation";

export interface OilAnalysisDetails {
  id: number;
  reference: string;
  sourceTypeId: OilAnalysisSourceType;
  sourceId: number;
  sourceReference?: string;
  oilQuantityLiters?: number;
  // Où se trouve l'huile analysée aujourd'hui.
  oilLocations: OilLocation[];
  acidityPercentage?: number;
  peroxideIndex?: number;
  k232?: number;
  k270?: number;
  organolepticGrade?: number;
  plannedDate?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt?: string;
  status: ProductionStatus;
}
