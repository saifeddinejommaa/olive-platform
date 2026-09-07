import type { OilAnalysisForList } from "../../domain/entities/OilAnalysisForList";
import type { OilAnalysisForListResponse } from "../responses/OilAnalysisForListResponse";

export function mapOilAnalysisForList(
  response: OilAnalysisForListResponse,
): OilAnalysisForList {
  return {
    id: response.id,
    reference: response.reference,
    sourceReference: response.sourceReference,
    analysisDate: response.analysisDate,
    createdAt: response.createdAt,
    status: response.status,
  };
}
