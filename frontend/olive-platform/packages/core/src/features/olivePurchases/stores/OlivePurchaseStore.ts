import { create } from "zustand";
import type { PagedResult } from "../../../core/PagedResult";
import type { OlivePurchasesFilter } from "../domain/entities/OlivePurchaseFilter";
import { GetOlivePurchases } from "../domain/usecases/GetOlivePurchases";
import { GetOlivePurchaseItems } from "../domain/usecases/GetOlivePurchaseItems";
import type { OlivePurchaseForList } from "../domain/entities/OlivePurchaseForList";
import type { CreatePressingOperationParams } from "../../production/domain/params/CreatePressingOperationParams";
import { CreatePressingOperation } from "../../production/domain/useCases/CreatePressingOperation";
import { ProductionStatus } from "../../production/domain/entities/ProductionStatus";

type OlivePurchasesStore = {
  olivePurchases: PagedResult<OlivePurchaseForList>;
  loading: boolean;
  launching: boolean;
  error: string | null;
  filters: OlivePurchasesFilter;

  setFilter: (key: keyof OlivePurchasesFilter, value: any) => void;
  clearFilters: () => void;
  fetchOlivePurchases: () => Promise<void>;
  launchPressing: (purchaseId: number) => Promise<void>;
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
    launching: false,
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
    launchPressing: async (purchaseId: number) => {
      set({ launching: true, error: null });

      try {
        const items = await GetOlivePurchaseItems(purchaseId);

        // Uniquement les lots pressables (restant, analyse terminée ou non requise).
        const pressable = items.filter((item) => item.isPressable);

        if (pressable.length === 0) {
          throw new Error(
            items.some((item) => item.toAnalysis && item.remainingQuantityKg > 0)
              ? "Les lots de cet achat sont en attente d'analyse."
              : "Aucune quantité restante à presser pour cet achat.",
          );
        }

        const inputs = pressable.map((item) => ({
          lotId: item.id,
          quantityKg: item.remainingQuantityKg,
        }));

        const request: CreatePressingOperationParams = {
          plannedDate: new Date().toISOString(),
          status: ProductionStatus.Planned,
          notes: null,
          startTime: null,
          endTime: null,
          oliveQuantityKg: pressable.reduce((total, item) => total + item.remainingQuantityKg, 0),
          oilQuantityLiters: null,
          inputs,
        };

        await CreatePressingOperation(request);
      } catch (error: any) {
        const message =
          error?.message ?? "Impossible de créer l'opération de pression.";

        set({ error: message });
        throw error;
      } finally {
        set({ launching: false });
      }
    },
  }),
);