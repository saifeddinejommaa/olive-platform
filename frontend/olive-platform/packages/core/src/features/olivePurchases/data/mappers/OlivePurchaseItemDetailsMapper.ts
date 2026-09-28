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
    remainingQuantityKg: response.remainingQuantityKg,
    status: response.status,
    needAnalysis: response.needAnalysis,
    isAnalyzed: response.isAnalyzed,
    toAnalysis: response.toAnalysis,
    isPressable: response.isPressable,
    pricePerKg: response.pricePerKg,
    totalAmount: response.totalAmount,
    notes: response.notes,
    analysis: response.analysis
      ? mapOliveAnalysisDetails(response.analysis)
      : null,
  };
}
