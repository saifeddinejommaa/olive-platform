import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type OlivePurchaseItemDetailsResponse = {
  id: number;

  reference: string;

  purchaseId: number;

  varietyId: OliveVarieties;

  agreedQuantityKg: number;

  pricePerKg: number;

  totalAmount: number | null;

  notes: string | null;

  analysis: OliveAnalysisDetailsResponse | null;
};
