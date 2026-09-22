import { create } from "zustand";
import type { DashboardSummary } from "../domain/dashboard.types";
import { GetSummary } from "../domain/usecases/GetSummary";

type DashboardState = {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  clear: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const summary = await GetSummary();

      set({
        summary,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        summary: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de charger le tableau de bord.",
      });
    }
  },

  clear: () => {
    set({
      summary: null,
      loading: false,
      error: null,
    });
  },
}));