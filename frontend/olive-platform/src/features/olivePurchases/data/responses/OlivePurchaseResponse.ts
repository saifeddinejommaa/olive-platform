import type { PurchaseStatus } from "../../domain/entities/PurchaseStatus";

export type OlivePurchaseResponse = {
 id: number;
  reference: string;
  supplierName: string;
  purchaseDate: string;
  status: PurchaseStatus;
  createdAt: string;
  totalQuantityKg: number;
  pricePerKg: number;
};
