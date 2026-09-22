import { SupplierRepository } from "../../data/repositories/SupplierRepository";

export const GetSuppliers = async () => {
  const suppliers = await SupplierRepository.getAll();

  return suppliers;
};