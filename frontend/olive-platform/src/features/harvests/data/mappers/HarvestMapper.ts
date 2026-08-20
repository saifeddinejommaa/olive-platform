import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestResponse } from "../responses/HarvestResponse";


export function HarvestMapper(
      response: HarvestResponse
    ): Harvest {
      return {
        id: response.id,

      harvestNumber:
        response.harvestNumber,

      plotId:
        response.plotId,

      harvestDate:
        response.harvestDate,

      quantityKg:
        response.quantityKg,

      qualityGrade:
        response.qualityGrade,

      notes:
        response.notes,
    }
}