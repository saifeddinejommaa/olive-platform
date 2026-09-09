import { create } from "zustand";
import { GetHarvestStocks } from "../../domain/usecases/GetHarvestStocks";
import type { HarvestStockDetails } from "../../domain/entities/HarvestStockDetails";

type HarvestStocksState = {
  stocks: HarvestStockDetails[];
  loading: boolean;
  error: string | null;

  fetchStocksList: (harvestId: number) => Promise<void>;
};

export const useHarvestStocksStore = create<HarvestStocksState>(
  (set) => ({
    stocks: [],
    loading: false,
    error: null,

    fetchStocksList: async (harvestId) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const stocks = await GetHarvestStocks(harvestId);

        set({
          stocks,
        });
      } catch (error) {
        set({
          stocks: [],
          error: "Impossible de charger les stocks de la récolte.",
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
        stocks: [],
        loading: false,
        error: null,
      });
    },
  }),
);

