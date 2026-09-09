import { mapOliveAnalysisDetails } from "../../../analyses/oliveAnalyses/data/mappers/OliveAnalysisDetailsMapper";
import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";
import type { HarvestDetails } from "../../domain/entities/HarvestDetails";
import type { HarvestDetailsResponse } from "../responses/HarvestDetailsResponse";

export function HarvestDetailsMapper(
  response: HarvestDetailsResponse,
): HarvestDetails {
  return {
    id: response.id,

    reference: response.reference,

    plotId: response.plotId,

    harvestDate: response.harvestDate,

    quantityKg: response.quantityKg,

    harvestedTrees: response.harvestedTrees,

    plannedTrees: response.plannedTrees,

    variety: response.variety as OliveVarieties,

    notes: response.notes,

    createdAt: response.createdAt,

    status: response.status as ProductionStatus,

    startTime: response.startTime,

    endTime: response.endTime,

    updatedAt: response.updatedAt,
    oliveAnalysis :  response.oliveAnalysis ? mapOliveAnalysisDetails(response.oliveAnalysis) : null
  };
}
