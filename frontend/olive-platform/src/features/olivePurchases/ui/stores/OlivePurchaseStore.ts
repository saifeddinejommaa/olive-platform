import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { OlivePurchasesFilter } from "../../domain/entities/OlivePurchaseFilter";
import { GetOlivePurchases } from "../../domain/usecases/GetOlivePurchases";
import type { OlivePurchaseForList } from "../../domain/entities/OlivePurchaseForList";

type OlivePurchasesStore = {
  olivePurchases: PagedResult<OlivePurchaseForList>;
  loading: boolean;
  error: string | null;
  filters: OlivePurchasesFilter;

  setFilter: (key: keyof OlivePurchasesFilter, value: any) => void;
  clearFilters: () => void;
  fetchOlivePurchases: () => Promise<void>;
};

export const useOlivePurchasesStore = create<OlivePurchasesStore>(
  (set, get) => ({
    olivePurchases: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },

    loading: false,
    error: null,

    filters: {
      purchaseNumber: "",
      supplierName: "",
      fromDate: "",
      toDate: "",
      status: undefined,
      pageNumber: 1,
      pageSize: 10,
    },

    setFilter: (key, value) =>
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      })),

    clearFilters: () =>
      set({
        filters: {
          purchaseNumber: "",
          supplierName: "",
          fromDate: "",
          toDate: "",
          status: undefined,
          pageNumber: 1,
          pageSize: 10,
        },

        error: null,
      }),

    fetchOlivePurchases: async () => {
      set({
        loading: true,
        error: null,
      });

      try {
        const data = await GetOlivePurchases(get().filters);

        set({
          olivePurchases: data,
        });
      } catch (error: any) {
        set({
          error:
            error?.message ??
            "Une erreur est survenue lors du chargement des achats d'olives.",
        });
      } finally {
        set({
          loading: false,
        });
      }
    },
  }),
);
