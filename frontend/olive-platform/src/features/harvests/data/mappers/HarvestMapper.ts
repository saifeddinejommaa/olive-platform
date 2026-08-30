import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";
import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestResponse } from "../responses/HarvestResponse";

export function HarvestMapper(response: HarvestResponse): Harvest {
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
  };
}
