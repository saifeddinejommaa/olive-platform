import type { NewSupplierFormValue, Supplier } from "../../../supplier/domain/entities/Supplier";

export type CreateSupplierParams = {
  name: string;
  phone: string | null;
  address: string | null;
};

export type SupplierService = {
  getActiveSuppliers: () => Promise<Supplier[]>;

  createSupplier: (
    params: CreateSupplierParams,
  ) => Promise<Supplier>;
};

export const mapNewSupplierToRequest = (
  supplier: NewSupplierFormValue,
): CreateSupplierParams => ({
  name: supplier.name.trim(),
  phone: supplier.phone.trim() || null,
  address: supplier.address.trim() || null,
});