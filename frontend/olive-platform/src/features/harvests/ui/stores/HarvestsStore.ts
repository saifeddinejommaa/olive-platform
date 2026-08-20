import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestFilters } from "../../domain/entities/HarvestsFilters";
import { GetHarvests } from "../../domain/usecases/GetHarvests";

type HarvestsStore = {
    harvests: PagedResult<Harvest>;
    loading: boolean;
    error: string | null;
    filters: HarvestFilters;

    setFilter: (key: keyof HarvestFilters, value: any) => void;
    clearFilters: () => void;
    fetchHarvests: () => Promise<void>;
};

export const useHarvestsStore = create<HarvestsStore>(
    (set, get) => ({
        harvests: {
            items: [],
            pageNumber: 1,
            pageSize: 10,
            totalCount: 0,
        },

        loading: false,
        error: null,

        filters: {
            pageNumber:1,
            pageSize:10
        },

        setFilter: (key, value) =>
            set((state) => ({
                filters: {
                    ...state.filters,
                    [key]: value,
                },
            })),

        clearFilters: () =>
            set({
                filters: {
                    pageNumber: 1,
                    pageSize: 10,
                },

                error: null,
            }),

        fetchHarvests: async () => {
            set({
                loading: true,
                error: null,
            });

            try {
                const data = await GetHarvests(
                    get().filters
                );

                set({
                    harvests: data,
                });
            } catch (error: any) {
                set({
                    error:
                        error?.message ??
                        "Une erreur est survenue lors du chargement des recoles.",
                });
            } finally {
                set({
                    loading: false,
                });
            }
        },
    })
);