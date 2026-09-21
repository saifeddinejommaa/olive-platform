import type { PurchaseStatus } from "./PurchaseStatus";
import type { SupplierDetails } from "./SupplierDetails";

export type OlivePurchaseDetails = {
  id: number;
  reference: string;
  purchaseDate: string;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt?: string;
  totalQuantity: number;
  totalAmount: number;
  notes: string | null;
  canBePressed: boolean;
  supplierDetails: SupplierDetails | null
};
