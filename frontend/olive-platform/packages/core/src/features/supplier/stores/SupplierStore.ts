import { create } from "zustand";
import type { Supplier } from "../domain/entities/Supplier";
import { GetSuppliers } from "../domain/useCases/GetSuppliers";

type SupplierState = {
  suppliers?: Supplier[];

  loading: boolean;
  error: string | null;

  fetchSuppliers: () => Promise<void>;
};

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: undefined,
  loading: false,
  error: null,

  fetchSuppliers: async () => {
    
    set({ loading: true, error: null });

    try {
      const suppliers = await GetSuppliers();
console.log(suppliers)
      set({
        suppliers,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de charger les vendeurs.",
      });

      throw error;
    }
  },
}));