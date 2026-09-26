import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { setSeasonIdProvider } from "../../core/SeasonContext";
import type { ConstantsStorage } from "../appConstants/ConstantsStorage";
import type { Season } from "./domain/entities/Season";
import { GetSeasons } from "./domain/usecases/GetSeasons";

type SeasonState = {
  seasons: Season[];

  // Seule valeur persistée : la campagne choisie par l'utilisateur.
  selectedSeasonId: number | null;

  loading: boolean;
  loaded: boolean;
  hydrated: boolean;
  error: string | null;

  fetchSeasons: () => Promise<void>;
  selectSeason: (seasonId: number) => void;
};

// Garde la campagne mémorisée si elle existe encore, sinon la campagne en cours.
function resolveSelection(
  seasons: Season[],
  selectedSeasonId: number | null,
): number | null {
  if (seasons.some((season) => season.id === selectedSeasonId)) {
    return selectedSeasonId;
  }

  return (
    seasons.find((season) => season.isCurrent)?.id ??
    seasons[0]?.id ??
    null
  );
}

export function createSeasonStore(storage: ConstantsStorage) {
  const store = create<SeasonState>()(
    persist(
      (set, get) => ({
        seasons: [],
        selectedSeasonId: null,
        loading: false,
        loaded: false,
        hydrated: false,
        error: null,

        fetchSeasons: async () => {
          if (get().loading) {
            return;
          }

          set({ loading: true, error: null });

          try {
            const seasons = await GetSeasons();

            set({
              seasons,
              selectedSeasonId: resolveSelection(
                seasons,
                get().selectedSeasonId,
              ),
              loaded: true,
            });
          } catch (error: any) {
            set({
              error:
                error?.message ?? "Impossible de charger les campagnes.",
            });
          } finally {
            set({ loading: false });
          }
        },

        selectSeason: (seasonId) => {
          set({ selectedSeasonId: seasonId });
        },
      }),
      {
        name: "olive-platform-season",

        storage: createJSONStorage(() => storage),

        partialize: (state) => ({
          selectedSeasonId: state.selectedSeasonId,
        }),
      },
    ),
  );

  // localStorage (web) hydrate de façon synchrone, AsyncStorage (mobile) non.
  const markHydrated = () => store.setState({ hydrated: true });

  store.persist.onFinishHydration(markHydrated);

  if (store.persist.hasHydrated()) {
    markHydrated();
  }

  setSeasonIdProvider(() => store.getState().selectedSeasonId);

  return store;
}
