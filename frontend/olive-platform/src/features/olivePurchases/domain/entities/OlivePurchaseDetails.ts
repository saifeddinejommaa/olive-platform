import type { PurchaseStatus } from "./PurchaseStatus";

export type OlivePurchaseDetails = {
  id: number;
  reference: string;
  supplierName: string;
  purchaseDate: string;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt?: string;
  totalQuantity: number;
  totalAmount: number;
  notes: string | null;
};
