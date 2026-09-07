import { create } from "zustand";
import type { UpdateOilAnalysisParams } from "../../domain/params/UpdateOilAnalysisParams";
import {
  CompleteOilAnalysis,
  GetOilAnalysisDetails,
  StartOilAnalysis,
  UpdateOilAnalysis,
} from "../../domain/usecases/GetOilAnalysisDetails";
import type { OilAnalysisDetails } from "../../domain/entities/OilAnalysisDetails";

type OilAnalysisDetailsState = {
  analysis: OilAnalysisDetails | null;

  loading: boolean;
  saving: boolean;
  error: string | null;

  fetchAnalysis: (id: number) => Promise<void>;
  update: (id: number, params: UpdateOilAnalysisParams) => Promise<void>;
  start: (id: number) => Promise<void>;
  complete: (id: number, params: UpdateOilAnalysisParams) => Promise<void>;
  abandon: (id: number) => Promise<void>;
  clear: () => void;
};

export const useOilAnalysisDetailsStore = create<OilAnalysisDetailsState>(
  (set, get) => ({
    analysis: null,
    loading: false,
    saving: false,
    error: null,
    abandon: async (id: number) => {
      set({ saving: true, error: null });
    },
    fetchAnalysis: async (id: number) => {
      set({ loading: true, error: null });

      try {
        const analysis = await GetOilAnalysisDetails(id);
        console.log("Fetched analysis:", analysis);
        set({ analysis, error: null });
      } catch (error) {
        set({
          analysis: null,
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger l'analyse d'huile.",
        });
      } finally {
        set({ loading: false });
      }
    },

    update: async (id, params) => {
      set({ saving: true, error: null });

      try {
        await UpdateOilAnalysis(id, params);
        await get().fetchAnalysis(id);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Impossible de modifier l'analyse d'huile.";
        set({ error: message });
        throw error;
      } finally {
        set({ saving: false });
      }
    },

    start: async (id) => {
      set({ saving: true, error: null });

      try {
        await StartOilAnalysis(id);
        await get().fetchAnalysis(id);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Impossible de lancer l'analyse d'huile.";
        set({ error: message });
        throw error;
      } finally {
        set({ saving: false });
      }
    },

    complete: async (id, params) => {
      set({ saving: true, error: null });

      try {
        await CompleteOilAnalysis(id, params);
        await get().fetchAnalysis(id);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Impossible de clôturer l'analyse d'huile.";
        set({ error: message });
        throw error;
      } finally {
        set({ saving: false });
      }
    },

    clear: () => {
      set({ analysis: null, loading: false, saving: false, error: null });
    },
  }),
);
