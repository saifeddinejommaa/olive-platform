import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import type { OliveAnalysis } from "../../domain/entities/OliveAnalysis";
import type { OliveAnalysisForListResponse } from "../responses/OliveAnalysesResponse";

// Taux renvoyés en décimal (ou null si non mesurés).
const toPercentage = (value: number | null | undefined) =>
  value != null ? Number(value) : undefined;

export function OliveAnalysisMapper(
  response: OliveAnalysisForListResponse,
): OliveAnalysis {
  return {
    id: response.id,

    sourceTypeId: response.sourceTypeId ?? null,

    sourceReference: response.sourceReference ?? null,

    plotReference: response.plotReference ?? null,

    reference: response.reference,

    humidityPercentage: toPercentage(response.humidityPercentage),

    waterPercentage: toPercentage(response.waterPercentage),

    oilPercentage: toPercentage(response.oilPercentage),

    acidityPercentage: toPercentage(response.acidityPercentage),

    plannedDate: response.plannedDate,

    startTime: response.startTime,

    endTime: response.endTime,

    status: response.status as ProductionStatus,
  };
}
