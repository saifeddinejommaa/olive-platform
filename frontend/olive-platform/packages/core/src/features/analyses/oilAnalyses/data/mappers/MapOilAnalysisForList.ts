import type { OilAnalysisForList } from "../../domain/entities/OilAnalysisForList";
import type { OilAnalysisForListResponse } from "../responses/OilAnalysisForListResponse";

export function mapOilAnalysisForList(
  response: OilAnalysisForListResponse,
): OilAnalysisForList {
  return {
    id: response.id,
    reference: response.reference,
    sourceTypeId: response.sourceTypeId,
    sourceReference: response.sourceReference,
    oilLocation: response.oilLocation ?? null,
    plannedDate: response.plannedDate,
    startTime: response.startTime,
    endTime: response.endTime,
    createdAt: response.createdAt,
    status: response.status,
    acidityPercentage: response.acidityPercentage ?? null,
    peroxideIndex: response.peroxideIndex ?? null,
    k232: response.k232 ?? null,
    k270: response.k270 ?? null,
    oilCategory: response.oilCategory ?? null,
  };
}
