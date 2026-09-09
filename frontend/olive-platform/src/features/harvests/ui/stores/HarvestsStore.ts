import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { HarvestFilters } from "../../domain/entities/HarvestsFilters";
import { GetHarvests } from "../../domain/usecases/GetHarvests";
import type { HarvestForList } from "../../domain/entities/HarvestForList";
import type { CreatePressingOperationParams } from "../../../production/domain/params/CreatePressingOperationParams";
import { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import { CreatePressingOperation } from "../../../production/domain/useCases/CreatePressingOperation";
import { GetHarvestStocks } from "../../domain/usecases/GetHarvestStocks";

type HarvestsStore = {
  harvests: PagedResult<HarvestForList>;
  loading: boolean;
  error: string | null;
  filters: HarvestFilters;

  setFilter: (key: keyof HarvestFilters, value: any) => void;
  clearFilters: () => void;
  fetchHarvests: () => Promise<void>;
  launchPressingOperation: (harvestId: number) => Promise<void>;
};

export const useHarvestsStore = create<HarvestsStore>((set, get) => ({
  harvests: {
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  },

  loading: false,
  error: null,

  filters: {
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
        pageNumber: 1,
        pageSize: 10,
      },

      error: null,
    }),
  launchPressingOperation: async (harvestId: number) => {
    set({
      loading: true,
      error: null,
    });
    try {
      const items = await GetHarvestStocks(harvestId);

      const inputs = items
        .filter((item) => item.quantityKg > 0)
        .map((item) => ({
          harvestId: harvestId,
          purchaseItemId: null,
          quantityKg: item.quantityKg,
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

      await CreatePressingOperation(request);

      const data = await GetHarvests(get().filters);

      set({
        harvests: data,
        loading: false
      });

    } catch (error: any) {
      const message =
        error?.message ?? "Impossible de créer l'opération de pression.";

      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  fetchHarvests: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const data = await GetHarvests(get().filters);

      set({
        harvests: data,
      });
    } catch (error: any) {
      set({
        error:
          error?.message ??
          "Une erreur est survenue lors du chargement des recoles.",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
