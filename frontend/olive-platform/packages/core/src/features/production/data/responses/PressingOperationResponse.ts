export type PressingOperationResponse = {
  id: number;
  operationNumber: string;
  pressingDate: string;
  createdAt: string;
  startTime: string | null;
  endTime: string | null;
  status: number;
  oilQuantityLiters: number | null;
  expectedOilLiters: number | null;
  oilYieldDeviationLiters: number | null;
  harvestNumber: string | null;
  purchaseNumber: string | null;
  notes: string | null;
};
