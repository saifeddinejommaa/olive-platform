import type { OliveAnalysisDetails } from "../../domain/entities/OliveAnalysisDetails";
import type { OliveAnalysisDetailsResponse } from "../repositories/responses/OliveAnalysesDetailsResponse";

export function mapOliveAnalysisDetails(
  response: OliveAnalysisDetailsResponse,
): OliveAnalysisDetails {
  return {
    id: response.id,

    reference: response.reference,

    sourceTypeId: response.sourceTypeId,

    sourceReference: response.sourceReference,

    humidityPercentage: response.humidityPercentage,

    waterPercentage: response.waterPercentage,

    oilPercentage: response.oilPercentage,

    acidityPercentage: response.acidityPercentage,

    analysisDate: response.analysisDate,

    createdAt: response.createdAt,

    updatedAt: response.updatedAt,

    varietyId: response.varietyId,

    status: response.status,
  };
}
