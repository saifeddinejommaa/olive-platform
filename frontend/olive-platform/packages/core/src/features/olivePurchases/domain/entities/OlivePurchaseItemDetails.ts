import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type OlivePurchaseItemDetails = {
  id: number;

  reference: string;

  purchaseId: number;

  variety: OliveVarieties;

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

  analysis: OliveAnalysisDetails | null;
};
