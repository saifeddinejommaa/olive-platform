export type CreatePressingOperationRequest = {
  plannedDate: string;
  startTime: string | null;
  endTime: string | null;
  status: number;
  oliveQuantityKg: number | null;
  oilQuantityLiters: number | null;
  notes: string | null;
  inputs: CreatePressingOperationInputRequest[];
};

export type CreatePressingOperationInputRequest = {
  lotId: number;
  quantityKg: number | null;
};
