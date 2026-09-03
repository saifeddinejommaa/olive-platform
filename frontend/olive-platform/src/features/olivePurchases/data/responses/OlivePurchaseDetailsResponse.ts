
export type OlivePurchaseDetailsResponse = {
  id: number;
  reference: string;
  supplierName: string;
  purchaseDate: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
  totalQuantity: number;
  totalAmount: number;
  notes: string | null;
};