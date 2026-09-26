import type { PressingParametersDetails } from "./PressingParametersDetails";
import type { ProductionStatus } from "./ProductionStatus";

export type PressingOperationDetails = {
  id: number;
  operationNumber: string;
  plannedDate: string;
  status: ProductionStatus;
  oliveQuantityKg: number;
  oilQuantityLiters: number | null;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
  expectedOilLiters: number | null;
  oilYieldDeviationLiters: number | null;
  parameters: PressingParametersDetails | null;
};
