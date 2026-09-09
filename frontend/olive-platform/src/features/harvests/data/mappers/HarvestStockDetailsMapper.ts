import type { HarvestStockDetails } from "../../domain/entities/HarvestStockDetails";
import type { HarvestStockDetailsResponse } from "../responses/HarvestStockDetailResponse";
 
export function HarvestStockDetailsMapper(
  response: HarvestStockDetailsResponse,
): HarvestStockDetails {
  return {
    id: response.id,
    reference: response.reference,
    quantityKg: response.quantityKg,
    status: response.status,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}