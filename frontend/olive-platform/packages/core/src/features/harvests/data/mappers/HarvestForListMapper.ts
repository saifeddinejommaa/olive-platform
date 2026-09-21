import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";
import type { HarvestForList } from "../../domain/entities/HarvestForList";
import type { HarvestForListResponse } from "../responses/HarvestForListResponse";

export function HarvestForListMapper(
  response: HarvestForListResponse,
): HarvestForList {
  return {
    id: response.id,

    reference: response.reference,

    plotId: response.plotId,

    harvestDate: response.harvestDate,

    quantityKg: response.quantityKg,

    harvestedTrees: response.harvestedTrees,

    plannedTrees: response.plannedTrees,

    variety: response.varietyId as OliveVarieties,

    notes: response.notes,

    createdAt: response.createdAt,

    status: response.status as ProductionStatus,

    startTime: response.startTime,

    endTime: response.endTime,

    updatedAt: response.updatedAt,
    canBePressed: response.canBePressed,
    pressed: response.pressing,
    analysis: response.analysis
  };
}
