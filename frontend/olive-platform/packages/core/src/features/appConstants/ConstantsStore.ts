import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type { AppConstants } from "./domain/models/AppConstants";
import { getAppConstants } from "./domain/useCases/GetAppConstants";
import type { ConstantsStorage } from "./ConstantsStorage";

type AppConstantsState = {
  Appconstants: AppConstants;

  loading: boolean;

  loaded: boolean;

  hydrated: boolean;

  fetchConstants: () => Promise<void>;
};

const initialConstants: AppConstants = {
  oliveVarieties: [],
  productionStatus: [],
  oilMovementTypes: [],
  invoiceTypes: [],
  invoiceStatuses: [],
  paymentMethods: [],
  purchaseStatus: [],
  costLineTypes: [],
  harvestTypes: [],
};

export function createConstantsStore(
  storage: ConstantsStorage,
) {
  return create<AppConstantsState>()(
    persist(
      (set, get) => ({
        Appconstants: initialConstants,

        loading: false,

        loaded: false,

        hydrated: false,

        fetchConstants: async () => {
          const state = get();
          if (state.loaded || state.loading) {
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
          } finally {
            set({
              loading: false,
            });
          }
        },
      }),
      {
        name: "olive-platform-constants",

        storage: createJSONStorage(
          () => storage,
        ),

        onRehydrateStorage: () => {
          return () => {
          };
        },
      },
    ),
  );
}