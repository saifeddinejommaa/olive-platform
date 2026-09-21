import type { SupplierDetailsResponse } from "./SupplierDetailsResponse";

export type OlivePurchaseDetailsResponse = {
  id: number;
  reference: string;
  purchaseDate: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
  totalQuantity: number;
  totalAmount: number;
  notes: string | null;
  canLaunchPression: boolean;
  supplier: SupplierDetailsResponse | null;
};
