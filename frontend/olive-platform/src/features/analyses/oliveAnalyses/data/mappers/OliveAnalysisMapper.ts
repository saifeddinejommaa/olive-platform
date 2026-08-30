import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OliveAnalysis } from "../../domain/entities/OliveAnalysis";
import type { OliveAnalysisForListResponse } from "../repositories/responses/OliveAnalysesResponse";

export function OliveAnalysisMapper(
  response: OliveAnalysisForListResponse,
): OliveAnalysis {
  return {
    id: response.id,

    sourceTypeId: 0,

    sourceId: response.sourceReference,

    reference: response.reference,

    humidityPercentage: undefined,

    waterPercentage: undefined,

    oilPercentage: undefined,

    acidityPercentage: undefined,

    analysisDate: response.analysisDate,

    createdAt: response.createdAt,

    updatedAt: response.updatedAt,

    status: response.status as ProductionStatus,
  };
}
