import type { PurchaseStatus } from "../../domain/entities/PurchaseStatus";
import type { OlivePurchaseResponse } from "../responses/OlivePurchaseResponse";

export function OlivePurchaseMapper(response: OlivePurchaseResponse) {
  return {
    id: response.id,

    purchaseNumber: response.purchaseNumber,

    supplierName: response.supplierName,

    purchaseDate: response.purchaseDate,

    status: response.status as PurchaseStatus,

    notes: null,
  };
}
