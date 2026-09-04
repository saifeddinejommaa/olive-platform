import type { HarvestStock } from "../../domain/entities/HarvestStock";
import type { HarvestStockResponse } from "../responses/HarvestStockResponse";

export function HarvestStockDetailsMapper(response: HarvestStockResponse): HarvestStock {
  return {
    id: response.id,
    reference: response.reference,
    quantityKg: response.quantityKg,
  };
}
