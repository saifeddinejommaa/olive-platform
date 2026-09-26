export type UpdatePressingOperationRequest = {
  plannedDate?: string | null;
  notes?: string | null;
  inputs?:
    | {
        harvestId?: number | null;
        purchaseItemId?: number | null;
        quantityKg: number;
      }[]
    | null;
};
