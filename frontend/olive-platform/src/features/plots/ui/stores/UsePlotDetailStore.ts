// src/features/production/plots/presentation/stores/UsePlotDetailStore.ts

import { create } from "zustand";
import type { PlotDetails } from "../../domain/entities/PlotDetails";
import { GetPlotDetails } from "../../domain/usecases/GetPlotsDetails";

interface PlotDetailStoreState {
  plot: PlotDetails | null;
  loading: boolean;
  error: string | null;
  fetchPlotDetail: (id: number) => Promise<void>;
  reset: () => void;
}

export const usePlotDetailStore = create<PlotDetailStoreState>((set) => ({
  plot: null,
  loading: false,
  error: null,

  fetchPlotDetail: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const plot = await GetPlotDetails(id);
      set({ plot, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erreur inconnue",
        loading: false,
      });
    }
  },

  reset: () => set({ plot: null, error: null }),
}));