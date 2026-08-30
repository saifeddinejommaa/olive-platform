import { create } from "zustand";

import { getOliveAnalyses } from "../../domain/usescases/GetOliveAnalyses";
import type { OliveAnalysesFilters } from "../../domain/entities/OliveAnalysesFilter";
import type { OliveAnalysis } from "../../domain/entities/OliveAnalysis";

type OliveAnalysesState = {
  analyses: OliveAnalysis[];
  total: number;
  loading: boolean;
  error: string | null;

  filter: OliveAnalysesFilters;

  fetchAnalyses: (params?: Partial<OliveAnalysesFilters>) => Promise<void>;

  setParams: (params: Partial<OliveAnalysesFilters>) => void;

  setPage: (pageNumber: number) => Promise<void>;

  setPageSize: (pageSize: number) => Promise<void>;

  refresh: () => Promise<void>;

  clear: () => void;
};

const initialParams: OliveAnalysesFilters = {
  pageNumber: 1,
  pageSize: 10,
};

export const useOliveAnalysesStore = create<OliveAnalysesState>((set, get) => ({
  // ============================================================
  // STATE
  // ============================================================

  analyses: [],
  total: 0,
  loading: false,
  error: null,
  filter: initialParams,

  // ============================================================
  // GET ANALYSES
  // ============================================================

  fetchAnalyses: async (newParams) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const currentFilter = get().filter;

      const filter: OliveAnalysesFilters = {
        ...currentFilter,
        ...newParams,
      };

      const response = await getOliveAnalyses(filter);

      set({
        analyses: response.items,
        total: response.totalCount,
        filter,
      });
    } catch (error) {
      set({
        error: "Impossible de charger les analyses d’olives.",
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ============================================================
  // SET PARAMS
  // ============================================================

  setParams: (newParams) => {
    set((state) => ({
      filter: {
        ...state.filter,
        ...newParams,
      },
    }));
  },

  // ============================================================
  // PAGINATION
  // ============================================================

  setPage: async (pageNumber) => {
    await get().fetchAnalyses({
      pageNumber,
    });
  },

  setPageSize: async (pageSize) => {
    await get().fetchAnalyses({
      pageSize,
      pageNumber: 1,
    });
  },

  // ============================================================
  // REFRESH
  // ============================================================

  refresh: async () => {
    await get().fetchAnalyses();
  },

  // ============================================================
  // CLEAR
  // ============================================================

  clear: () => {
    set({
      analyses: [],
      total: 0,
      loading: false,
      error: null,
      filter: initialParams,
    });
  },
}));
