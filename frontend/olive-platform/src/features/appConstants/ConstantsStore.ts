import { create } from "zustand";
import type { AppConstants } from "./domain/models/AppConstants";
import { getAppConstants } from "./domain/useCases/GetAppConstants";

type AppConstantsState = {
  Appconstants: AppConstants;

  loading: boolean;
  loaded: boolean;

  fetchConstants: () => Promise<void>;
};

const initialConstants: AppConstants = {
  oliveVarieties: [],
  sampleStatuses: [],
  productionStatuses: [],
  oilMovementTypes: [],
  invoiceTypes: [],
  invoiceStatuses: [],
  paymentMethods: [],
};

export const useConstantsStore =
  create<AppConstantsState>((set, get) => ({
    Appconstants: initialConstants,

    loading: false,
    loaded: false,

    fetchConstants: async () => {
      // Déjà chargées → on ne fait rien
      if (get().loaded) {
        return;
      }

      // Évite également plusieurs appels simultanés
      if (get().loading) {
        return;
      }

      set({
        loading: true,
      });

      try {
        const data = await getAppConstants();

        set({
          Appconstants: data,
          loaded: true,
        });
      } catch (error) {
        console.error(
          "Erreur lors du chargement des constantes",
          error
        );

        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },
  }));