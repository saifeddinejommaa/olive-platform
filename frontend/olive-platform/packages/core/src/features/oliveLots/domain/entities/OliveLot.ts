// Lot d'olives (stock de récolte ou ligne d'achat), tel que renvoyé par l'API.
export type OliveLot = {
  id: number;
  reference: string;
  // 1 = récolte, 2 = achat.
  sourceType: number;
  harvestId: number | null;
  purchaseId: number | null;
  sourceReference: string | null;
  varietyId: number | null;
  quantityKg: number;
  remainingKg: number;
  pricePerKg: number | null;
  status: number;
  needAnalysis: boolean;
  oliveAnalysisId: number | null;
  oliveAnalysisReference: string | null;
  analysisStatus: number | null;
  oilPercentage: number | null;
  isAnalyzed: boolean;
  toAnalysis: boolean;
  isPressable: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OliveLotsFilter = {
  harvestId?: number;
  purchaseId?: number;
  sourceType?: number;
  status?: number;
  // Lots avec du restant (Disponible / Partiellement utilisé).
  available?: boolean;
  search?: string;
};
