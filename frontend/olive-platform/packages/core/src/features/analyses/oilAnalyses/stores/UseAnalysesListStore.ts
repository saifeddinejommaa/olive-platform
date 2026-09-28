import { create } from "zustand";
import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OilAnalysisForList } from "../domain/entities/OilAnalysisForList";
import { GetOilAnalyses } from "../domain/usecases/GetOilAnalysis";

// "" = pas de filtre. Du : début de l'analyse ; Au : fin de l'analyse.
type Filters = {
  reference: string;
  pressingReference: string;
  fromDate: string;
  toDate: string;
  status: ProductionStatus | null;
};

type OilAnalysesListState = {
  items: OilAnalysisForList[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;

  filters: Filters;

  loading: boolean;
  error: string | null;

  fetchList: () => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  setPage: (pageNumber: number) => void;
  clear: () => void;
};

const initialFilters: Filters = {
  reference: "",
  pressingReference: "",
  fromDate: "",
  toDate: "",
  status: null,
};

export const useOilAnalysesListStore = create<OilAnalysesListState>(
  (set, get) => ({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,

    filters: initialFilters,

    loading: false,
    error: null,

    fetchList: async () => {
      set({ loading: true, error: null });

      try {
        const { filters, pageNumber, pageSize } = get();

        const result = await GetOilAnalyses({
          reference: filters.reference || undefined,
          pressingReference: filters.pressingReference || undefined,
          fromDate: filters.fromDate || undefined,
          toDate: filters.toDate || undefined,
          status: filters.status ?? undefined,
          pageNumber,
          pageSize,
        });

        set({
          items: result.items,
          totalCount: result.totalCount,
          pageNumber: result.pageNumber,
          pageSize: result.pageSize,
        });
      } catch (error) {
        set({
          items: [],
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger les analyses d'huile.",
        });
      } finally {
        set({ loading: false });
      }
    },

    setFilters: (filters) => {
      set((state) => ({
        filters: { ...state.filters, ...filters },
        pageNumber: 1,
      }));
    },

    setPage: (pageNumber) => {
      set({ pageNumber });
    },

    clear: () => {
      set({
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        filters: initialFilters,
        loading: false,
        error: null,
      });
    },
  }),
);
