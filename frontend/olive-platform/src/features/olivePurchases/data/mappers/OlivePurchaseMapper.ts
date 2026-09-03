import type { OlivePurchase } from "../../domain/entities/OlivePurchase";
import type { PurchaseStatus } from "../../domain/entities/PurchaseStatus";
import type { OlivePurchaseResponse } from "../responses/OlivePurchaseResponse";

export function OlivePurchaseMapper(
  response: OlivePurchaseResponse,
): OlivePurchase {
  return {
    id: response.id,
    reference: response.reference,
    createdAt: response.createdAt,
    supplierName: response.supplierName,
    purchaseDate: response.purchaseDate,
    status: response.status as PurchaseStatus,
    notes: null,
  };
}
