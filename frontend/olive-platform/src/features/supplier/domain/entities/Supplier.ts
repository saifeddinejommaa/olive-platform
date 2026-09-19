export type Supplier = {
  id: number;
  name: string;
  reference: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
};

export type NewSupplierFormValue = {
  name: string;
  phone: string;
  address: string;
};

export type SupplierMode = "existing" | "new";