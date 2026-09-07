import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type OlivePurchaseItemDetails = {
  id: number;

  reference: string;

  purchaseId: number;

  variety: OliveVarieties;

  agreedQuantityKg: number;

  pricePerKg: number;

  totalAmount: number | null;

  notes: string | null;

  analysis: OliveAnalysisDetails | null;
};
