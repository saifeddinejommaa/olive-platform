import type { PressingOperationInputStatus } from "./PressingOperationInputStatus";

export type InputSourceType = "harvest" | "purchase";

export type PressingOperationInput = {
  id: string;
  harvestId: number | null;
  purchaseItemId: number | null;
  reference: string;
  quantityKg: string | number;
  status: PressingOperationInputStatus;
};
