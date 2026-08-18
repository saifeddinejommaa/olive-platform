import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { PressingOperationFilters } from "../../domain/entities/PressingOperationFilters";
import type { PressingOperation } from "../../domain/entities/PressingOperation";
import { GetPressingOperations } from "../../domain/useCases/GetPressingOperations";


type PressingOperations = {
    PressingOperations: PagedResult<PressingOperation>;
    loading: boolean;
    filters: PressingOperationFilters;

    setFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    fetcPressingOperations: () => Promise<void>;
};

export const usePressingOperationsStore = create<PressingOperations>((set, get) => ({
    PressingOperations: { items: [], pageNumber: 0, pageSize: 10, totalCount: 0 },
    loading: false,
    filters: {
        harvestNumber: '',
        purchaseNumber: '',
        pressingDate: '',
        operationNumber: '',
        pageNumber: 1,
        pageSize: 10
    },
    setFilter: (key, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
            },
        })),

    clearFilters: () => set({
        filters: {
            harvestNumber: '',
            purchaseNumber: '',
            pressingDate: '',
            operationNumber: '',
            pageNumber: 1,
            pageSize: 10
        }
    }),

    fetcPressingOperations: async () => {
        set({ loading: true });
        console.log('Fetching pressing operations with filters:', get().filters);
        try {
            const data = await GetPressingOperations(get().filters);
            set({ PressingOperations: data });
        } finally {
            set({ loading: false });
        }
    },
}));