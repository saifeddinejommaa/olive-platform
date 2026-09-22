import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";
import type { OlivePurchaseItemResponse } from "../responses/OlivePurchaseItemResponse";

export function OlivePurchaseItemMapper(response: OlivePurchaseItemResponse) {
  return {
    id: response.id,

    reference: response.reference,

    variety: response.varietyId as OliveVarieties,

    agreedQuantityKg: response.agreedQuantityKg,

    pricePerKg: response.pricePerKg,
  };
}
