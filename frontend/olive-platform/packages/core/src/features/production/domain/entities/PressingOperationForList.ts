import type { ProductionStatus } from "./ProductionStatus";

export interface PressingOperationForList {
  total: number;
  id: number;
  operationNumber: string;
  status: ProductionStatus;
  plannedDate: string;
  oliveQuantityKg: number | null;
  oilQuantityLiters: number | null;
  yieldPercentage: number | null;
  startTime: string | null;
  endTime: string | null;
  oliveAnalysis: ProductionStatus | null;
  oilAnalysis: ProductionStatus | null;
}