import type { OlivePurchaseForList } from "../../domain/entities/OlivePurchaseForList";
import type { PurchaseStatus } from "../../domain/entities/PurchaseStatus";
import type { OlivePurchaseForListResponse } from "../responses/OlivePurchaseForListResponse";

export function OlivePurchaseForListMapper(
  response: OlivePurchaseForListResponse,
): OlivePurchaseForList {
  return {
    id: response.id,
    reference: response.reference,
    supplierName: response.supplierName,
    purchaseDate: response.purchaseDate,
    status: response.status as PurchaseStatus,
    createdAt: response.createdAt,
    pressed: response.pressed,
    analyseStatus: response.analyseStatus,
    quantityKg: response.totalQuantityKg,
  };
}