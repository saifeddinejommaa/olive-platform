import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import { PurchaseStatus } from "../../domain/entities/PurchaseStatus";
import type { OlivePurchaseDetailsResponse } from "../responses/OlivePurchaseDetailsResponse";

export function OlivePurchaseDetailsMapper(
  response: OlivePurchaseDetailsResponse,
): OlivePurchaseDetails {
  return {
    id: response.id,
    reference: response.reference,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    notes: response.notes,
    purchaseDate: response.purchaseDate,
    supplierName: response.supplierName,
    status: response.status as PurchaseStatus,
    totalQuantity: response.totalQuantity,
    totalAmount: response.totalAmount,
    canBePressed: response.canLaunchPression,
  };
}
