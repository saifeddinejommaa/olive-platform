export type UpdatePressingOperationRequest = {
  planificationDate?: string | null;
  notes?: string | null;
  inputs?:
    | {
        harvestId?: number | null;
        purchaseItemId?: number | null;
        quantityKg: number;
      }[]
    | null;
};
