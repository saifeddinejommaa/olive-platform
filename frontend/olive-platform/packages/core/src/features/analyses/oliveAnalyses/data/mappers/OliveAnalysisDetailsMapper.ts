import type { OliveAnalysisDetails } from "../../domain/entities/OliveAnalysisDetails";
import type { OliveAnalysisDetailsResponse } from "../responses/OliveAnalysesDetailsResponse";

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

    plannedDate: response.plannedDate,

    startTime: response.startTime,

    endTime: response.endTime,

    varietyId: response.varietyId,

    status: response.status,
  };
}
