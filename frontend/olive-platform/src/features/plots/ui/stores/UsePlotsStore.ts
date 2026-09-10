// src/features/production/plots/presentation/stores/plotsStore.ts

import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { PlotForList } from "../../domain/entities/PlotForList";
import type { PlotsRequestFilter } from "../../domain/entities/PlotsRequestFilter";
import { GetPlots } from "../../domain/usecases/GetPlots";

interface PlotsStoreState {
  Plots: PagedResult<PlotForList> | null;
  filters: PlotsRequestFilter;
  loading: boolean;
  error: string | null;
  setFilter: (field: keyof PlotsRequestFilter, value: string | number) => void;
  fetchPlots: () => Promise<void>;
}

const initialFilters: PlotsRequestFilter = {
  reference: "",
  name: "",
  pageNumber: 1,
  pageSize: 10,
};

export const usePlotsStore = create<PlotsStoreState>((set, get) => ({
  Plots: null,
  filters: initialFilters,
  loading: false,
  error: null,

  setFilter: (field, value) => {
    set((state) => ({
      filters: { ...state.filters, [field]: value },
    }));
  },

  fetchPlots: async () => {
    set({ loading: true, error: null });
    try {
      const result = await GetPlots(get().filters);
      set({ Plots: result, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erreur inconnue",
        loading: false,
      });
    }
  },
}));