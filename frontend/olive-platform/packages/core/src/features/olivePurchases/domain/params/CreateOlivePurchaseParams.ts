
export interface CreateOlivePurchaseItemParams {
  varietyId: number | null;
  agreedQuantityKg: number;
  pricePerKg: number;
  goesToAnalysis: boolean;
}

export interface CreateOlivePurchaseParams {
  supplierId: number | null;
  purchaseDate: string;
  status: number;
  notes: string | null;
  items: CreateOlivePurchaseItemParams[];
  newSupplier: CreateNewSupplierParams | null;
}

export interface CreateNewSupplierParams {
  name: string;
  address: string | null;
  phone: string | null;
}
