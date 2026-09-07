import { create } from "zustand";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import { PurchaseStatus } from "../../domain/entities/PurchaseStatus";
import { GetOlivePurchaseDetails } from "../../domain/usecases/GetOlivePurchaseDetails";
import { ValidateOlivePurchase } from "../../domain/usecases/ValidateOlivePurchase";

type OlivePurchaseDetailsState = {
  details?: OlivePurchaseDetails;

  loading: boolean;
  saving: boolean;
  error: string | null;

  fetchPurchase: (id: number) => Promise<void>;
  validate: (id: number) => Promise<void>;

  clear: () => void;
};

export const useOlivePurchaseDetailsStore = create<OlivePurchaseDetailsState>(
  (set) => ({
    details: undefined,
    loading: false,
    saving: false,
    error: null,

    fetchPurchase: async (id: number) => {
      set({ loading: true, error: null });
      const olivePurchaseDetails = await GetOlivePurchaseDetails(id);
      try {
        set({
          details: olivePurchaseDetails,
          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger l'achat d'olives.",
        });

        throw error;
      }
    },

    validate: async (id: number) => {

      set({ saving: true, error: null });
      
      await ValidateOlivePurchase(id);
      
      var details = await GetOlivePurchaseDetails(id);
      set({ saving: false, details });
    },

    clear: () => {
      set({ details: undefined, loading: false, saving: false, error: null });
    },
  }),
);
