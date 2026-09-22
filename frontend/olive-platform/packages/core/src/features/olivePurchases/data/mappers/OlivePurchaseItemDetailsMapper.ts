import { mapOliveAnalysisDetails } from "../../../analyses/oliveAnalyses/data/mappers/OliveAnalysisDetailsMapper";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";
import type { OlivePurchaseItemDetailsResponse } from "../responses/OlivePurchaseItemDetailsResponse";

export function OlivePurchaseItemDetailsMapper(
  response: OlivePurchaseItemDetailsResponse,
): OlivePurchaseItemDetails {
  return {
    id: response.id,
    reference: response.reference,
    purchaseId: response.purchaseId,
    variety: response.varietyId,
    agreedQuantityKg: response.agreedQuantityKg,
    pricePerKg: response.pricePerKg,
    totalAmount: response.totalAmount,
    notes: response.notes,
    analysis: response.analysis
      ? mapOliveAnalysisDetails(response.analysis)
      : null,
  };
}
