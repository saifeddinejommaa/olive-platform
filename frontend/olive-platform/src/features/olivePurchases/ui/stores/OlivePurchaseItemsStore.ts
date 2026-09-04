import { create } from "zustand";
import { GetOlivePurchaseItems } from "../../domain/usecases/GetOlivePurchaseItems";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";

type OlivePurchaseItemsState = {
  items: OlivePurchaseItemDetails[];
  loading: boolean;
  error: string | null;

  fetchItems: (purchaseId: number) => Promise<void>;

  clear: () => void;
};

export const useOlivePurchaseItemsStore = create<OlivePurchaseItemsState>(
  (set) => ({
    items: [],
    loading: false,
    error: null,

    fetchItems: async (purchaseId: number) => {
      set({ loading: true, error: null });

      try {
        const items = await GetOlivePurchaseItems(purchaseId);

        set({
          items,
          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger les olives de l'achat.",
        });

        throw error;
      }
    },

    clear: () => {
      set({
        items: [],
        loading: false,
        error: null,
      });
    },
  }),
);
