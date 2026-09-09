import { create } from "zustand";

import { GetHarvestOliveAnalysis } from "../../domain/usecases/GetHarvestOliveAnalysis";
import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";

type HarvestOliveAnalysisState = {
  analysis: OliveAnalysisDetails | null;
  loading: boolean;
  error: string | null;

  fetchAnalysis: (harvestId: number) => Promise<void>;

  clear: () => void;
};

export const useHarvestOliveAnalysisStore =
  create<HarvestOliveAnalysisState>((set) => ({
    analysis: null,
    loading: false,
    error: null,

    fetchAnalysis: async (harvestId) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const analysis = await GetHarvestOliveAnalysis(harvestId);

        set({
          analysis,
        });
      } catch (error) {
        set({
          analysis: null,
          error: "Impossible de charger l'analyse de la récolte.",
        });

        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    clear: () => {
      set({
        analysis: null,
        loading: false,
        error: null,
      });
    },
  }));