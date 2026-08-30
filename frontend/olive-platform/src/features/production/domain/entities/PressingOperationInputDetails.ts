export type PressingOperationInputDetails = {
  id: number;
  sourceType: "harvest" | "purchase";
  sourceReference: string;
  quantityKg: number;
  harvestId: number | null;
  purchaseItemId: number | null;
};
