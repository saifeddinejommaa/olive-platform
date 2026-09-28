import type { HarvestStockStatus } from "../../domain/entities/HarvestStockStatus";

export type HarvestStockDetailsResponse = {
  id: number;
  reference: string;
  quantityKg: number;
  remainingKg: number;
  status: HarvestStockStatus;
  varietyId: number | null;
  needAnalysis: boolean;
  oliveAnalysisId: number | null;
  analysisStatus: number | null;
  isAnalyzed: boolean;
  toAnalysis: boolean;
  isPressable: boolean;
  createdAt: string;
  updatedAt: string;
};
