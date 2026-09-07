import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type OlivePurchaseItemDetailsResponse = {
  id: number;

  reference: string;

  purchaseId: number;

  variety: OliveVarieties;

  agreedQuantityKg: number;

  pricePerKg: number;

  totalAmount: number | null;

  notes: string | null;

  analysis: OliveAnalysisDetailsResponse | null;
};
