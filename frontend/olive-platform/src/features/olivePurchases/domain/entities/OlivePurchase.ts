import type { PurchaseStatus } from "./PurchaseStatus";

export type OlivePurchase = {
  id: number;
  reference: string;
  supplierName: string;
  purchaseDate: string;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt?: string;
  notes: string | null;
};
