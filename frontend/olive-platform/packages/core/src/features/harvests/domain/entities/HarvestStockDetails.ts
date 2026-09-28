import type { HarvestStockStatus } from "./HarvestStockStatus";

// Stock de récolte = lot d'olives (olive_lots).
export type HarvestStockDetails = {
  id: number;
  reference: string;
  quantityKg: number;
  remainingKg: number;
  status: HarvestStockStatus;
  varietyId: number | null;
  needAnalysis: boolean;
  oliveAnalysisId: number | null;
  analysisStatus: number | null;
  // Analyse terminée.
  isAnalyzed: boolean;
  // Analyse requise mais non terminée : le lot ne peut pas être pressé.
  toAnalysis: boolean;
  isPressable: boolean;
  createdAt: string;
  updatedAt: string;
};
