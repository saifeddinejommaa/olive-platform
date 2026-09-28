import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type OlivePurchaseItemDetailsResponse = {
  id: number;

  reference: string;

  purchaseId: number;

  varietyId: OliveVarieties;

  agreedQuantityKg: number;

  // Lot d'olives : restant, statut et analyse.
  remainingQuantityKg: number;

  status: number;

  needAnalysis: boolean;

  isAnalyzed: boolean;

  toAnalysis: boolean;

  isPressable: boolean;

  pricePerKg: number;

  totalAmount: number | null;

  notes: string | null;

  analysis: OliveAnalysisDetailsResponse | null;
};
