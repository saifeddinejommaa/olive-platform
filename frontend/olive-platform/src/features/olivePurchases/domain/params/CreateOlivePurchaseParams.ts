export interface CreateOlivePurchaseItemParams {
  varietyId: number | null;
  agreedQuantityKg: number;
  pricePerKg: number;
  goesToAnalysis: boolean;
}

export interface CreateOlivePurchaseParams {
  supplierName: string;
  purchaseDate: string;
  status: number;
  notes: string | null;
  items: CreateOlivePurchaseItemParams[];
}