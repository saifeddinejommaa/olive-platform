import { create } from "zustand";

import type { OliveLot, OliveLotsFilter } from "../domain/entities/OliveLot";
import { GetOliveLots } from "../domain/usecases/GetOliveLots";

// Filtres de l'écran « Stock d'olives » (campagne injectée par le client HTTP).
export type OliveLotsScreenFilter = {
  // Référence du lot, de la récolte ou de l'achat.
  search: string;
  // 1 = récolte, 2 = achat.
  sourceType?: number;
  // Statut du lot (état de pression).
  status?: number;
};

const initialFilter: OliveLotsScreenFilter = {
  search: "",
  sourceType: undefined,
  status: undefined,
};

type OliveLotsState = {
  lots: OliveLot[];
  loading: boolean;
  error: string | null;
  filter: OliveLotsScreenFilter;

  setFilter: <K extends keyof OliveLotsScreenFilter>(
    key: K,
    value: OliveLotsScreenFilter[K],
  ) => void;
  clearFilter: () => void;
  fetchLots: () => Promise<void>;
};

export const useOliveLotsStore = create<OliveLotsState>((set, get) => ({
  lots: [],
  loading: false,
  error: null,
  filter: initialFilter,

  setFilter: (key, value) =>
    set((state) => ({ filter: { ...state.filter, [key]: value } })),

  clearFilter: () => set({ filter: initialFilter, error: null }),

  fetchLots: async () => {
    set({ loading: true, error: null });

    try {
      const { search, sourceType, status } = get().filter;

      const request: OliveLotsFilter = {
        search: search.trim() || undefined,
        sourceType,
        status,
      };

      set({ lots: await GetOliveLots(request) });
    } catch (error: any) {
      set({
        lots: [],
        error: error?.message ?? "Impossible de charger le stock d'olives.",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
