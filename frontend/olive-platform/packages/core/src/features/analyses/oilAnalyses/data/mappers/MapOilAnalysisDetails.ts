import type { OilAnalysisDetails } from "../../domain/entities/OilAnalysisDetails";
import type { OilAnalysisDetailsResponse } from "../responses/OilAnalysisDetailsResponse";

export function mapOilAnalysisDetails(
  response: OilAnalysisDetailsResponse,
): OilAnalysisDetails {
  return {
    id: response.id,
    reference: response.reference,
    sourceTypeId: response.sourceTypeId,
    sourceReference: response.sourceReference ?? undefined,
    acidityPercentage: response.acidityPercentage ?? undefined,
    peroxideIndex: response.peroxideIndex ?? undefined,
    k232: response.k232 ?? undefined,
    k270: response.k270 ?? undefined,
    organolepticGrade: response.organolepticGrade ?? undefined,
    analysisDate: response.analysisDate,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt ?? undefined,
    status: response.status,
  };
}
