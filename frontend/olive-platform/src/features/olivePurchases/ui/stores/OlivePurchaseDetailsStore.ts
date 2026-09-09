import { create } from "zustand";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import { GetOlivePurchaseDetails } from "../../domain/usecases/GetOlivePurchaseDetails";
import { ValidateOlivePurchase } from "../../domain/usecases/ValidateOlivePurchase";
import { CreatePressingOperation } from "../../../production/domain/useCases/CreatePressingOperation";
import { GetOlivePurchaseItems } from "../../domain/usecases/GetOlivePurchaseItems";
import type { CreatePressingOperationParams } from "../../../production/domain/params/CreatePressingOperationParams";
import { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

type OlivePurchaseDetailsState = {
  details?: OlivePurchaseDetails;

  loading: boolean;
  saving: boolean;
  error: string | null;

  fetchPurchase: (id: number) => Promise<void>;
  validate: (id: number) => Promise<void>;
  launchPressing: (purchaseId: number) => Promise<number>;
  clear: () => void;
};

export const useOlivePurchaseDetailsStore = create<OlivePurchaseDetailsState>(
  (set) => ({
    details: undefined,
    loading: false,
    saving: false,
    error: null,
    launchPressing: async (purchaseId: number) => {
      try {
        set({ loading: true, error: null });
        const items = await GetOlivePurchaseItems(purchaseId);

        const inputs = items
          .filter((item) => item.agreedQuantityKg > 0)
          .map((item) => ({
            harvestId: null,
            purchaseItemId: item.id,
            quantityKg: item.agreedQuantityKg,
          }));

        if (inputs.length === 0) {
          throw new Error("Aucune quantité restante à presser pour cet achat.");
        }

        const request: CreatePressingOperationParams = {
          createdAt: new Date().toISOString(),
          status: ProductionStatus.Planned,
          notes: null,
          startTime: null,
          endTime: null,
          oliveQuantityKg: inputs.reduce((total, input) => total + input.quantityKg, 0),
          oilQuantityLiters: null,
          inputs,
        };

        const id = (await CreatePressingOperation(request)).Response;

        return id;
      } catch (error: any) {
        const message =
          error?.message ?? "Impossible de créer l'opération de pression.";

        set({ error: message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

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
