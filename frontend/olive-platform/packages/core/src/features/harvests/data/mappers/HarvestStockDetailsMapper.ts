import type { HarvestStockDetails } from "../../domain/entities/HarvestStockDetails";
import type { HarvestStockDetailsResponse } from "../responses/HarvestStockDetailResponse";

export function HarvestStockDetailsMapper(
  response: HarvestStockDetailsResponse,
): HarvestStockDetails {
  return {
    id: response.id,
    reference: response.reference,
    quantityKg: response.quantityKg,
    remainingKg: response.remainingKg,
    status: response.status,
    varietyId: response.varietyId ?? null,
    needAnalysis: response.needAnalysis,
    oliveAnalysisId: response.oliveAnalysisId ?? null,
    analysisStatus: response.analysisStatus ?? null,
    isAnalyzed: response.isAnalyzed,
    toAnalysis: response.toAnalysis,
    isPressable: response.isPressable,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}
