import type { OilAnalysisForList } from "../../domain/entities/OilAnalysisForList";
import type { OilAnalysisForListResponse } from "../responses/OilAnalysisForListResponse";

export function mapOilAnalysisForList(
  response: OilAnalysisForListResponse,
): OilAnalysisForList {
  return {
    id: response.id,
    reference: response.reference,
    sourceReference: response.sourceReference,
    plannedDate: response.plannedDate,
    startTime: response.startTime,
    endTime: response.endTime,
    createdAt: response.createdAt,
    status: response.status,
  };
}
