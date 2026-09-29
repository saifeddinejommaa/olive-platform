// Lot d'olives rattaché à une analyse.
export type OliveAnalysisLot = {
  id: number;
  reference: string;
  // 1 : récolte, 2 : achat.
  sourceTypeId: number;
  harvestId: number | null;
  purchaseId: number | null;
  sourceReference: string | null;
  quantityKg: number;
  remainingKg: number;
  status: number;
  statusLabel: string | null;
  createdAt: string;
};
