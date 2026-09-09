import { create } from "zustand";

import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestDetails } from "../../domain/entities/HarvestDetails";

import type { UpdateHarvestParams } from "../../domain/params/UpdateHarvestParams";
import type { HarvestStockParams } from "../../domain/params/HarvestStockParams";
import type { CompleteHarvestParams } from "../../domain/params/CompleteHarvestParams";

import { updateHarvest } from "../../domain/usecases/UpdateHarvest";
import { startHarvest } from "../../domain/usecases/StartHarvest";
import { completeHarvest } from "../../domain/usecases/CompleteHarvest";
import { cancelHarvest } from "../../domain/usecases/CancelHarvest";
import { GetHarvestDetails } from "../../domain/usecases/GetHarvestDetails";

type HarvestDetailsState = {
  harvest: HarvestDetails | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  fetchHarvest: (id: number) => Promise<void>;

  update: (
    id: number,
    params: UpdateHarvestParams,
  ) => Promise<Harvest>;

  start: (id: number) => Promise<void>;

  complete: (
    id: number,
    quantityKg: number,
    harvestedTrees: number,
    completeDate: string,
    stocks: HarvestStockParams[],
    proceedAnalyse: boolean,
  ) => Promise<void>;

  cancel: (id: number) => Promise<void>;

  clear: () => void;
};

export const useHarvestDetailsStore = create<HarvestDetailsState>(
  (set) => ({
    harvest: null,
    loading: false,
    saving: false,
    error: null,

    fetchHarvest: async (id) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const harvest = await GetHarvestDetails(id);

        set({
          harvest,
        });
      } catch (error) {
        set({
          error: "Impossible de charger la récolte.",
        });

        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    update: async (id, params) => {
      try {
        set({
          saving: true,
          error: null,
        });

         await updateHarvest(id, params);

         const harvest = await GetHarvestDetails(id);

        set({
          harvest,
        });

        return harvest;
      } catch (error) {
        set({
          error: "Impossible de modifier la récolte.",
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    start: async (id) => {
      try {
        set({
          saving: true,
          error: null,
        });

        // Le backend retourne 204 No Content.
        await startHarvest(id);

        // On recharge la récolte pour récupérer son nouveau statut
        // ainsi que les éventuelles données modifiées par le backend.
        const harvest = await GetHarvestDetails(id);

        set({
          harvest,
        });
      } catch (error) {
        set({
          error: "Impossible de lancer la récolte.",
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    complete: async (
      id,
      quantityKg,
      harvestedTrees,
      completeDate,
      stocks,
      proceedAnalyse,
    ) => {
      try {
        set({
          saving: true,
          error: null,
        });

        const params: CompleteHarvestParams = {
          quantityKg,
          harvestedTrees,
          completeDate,
          stocks,
          proceedAnalyse,
        };

        await completeHarvest(id, params);

        // Le backend vient de clôturer la récolte.
        // On recharge les informations pour récupérer
        // le nouveau statut et les données mises à jour.
        const harvest = await GetHarvestDetails(id);

        set({
          harvest,
        });
      } catch (error) {
        set({
          error: "Impossible de clôturer la récolte.",
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    cancel: async (id) => {
      try {
        set({
          saving: true,
          error: null,
        });

        await cancelHarvest(id);

        // On recharge la récolte pour récupérer le nouveau statut.
        const harvest = await GetHarvestDetails(id);

        set({
          harvest,
        });
      } catch (error) {
        set({
          error: "Impossible d'annuler la récolte.",
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    clear: () => {
      set({
        harvest: null,
        loading: false,
        saving: false,
        error: null,
      });
    },
  }),
);