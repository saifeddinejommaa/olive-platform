import { create } from "zustand";
import type { AppConstants } from "./domain/models/AppConstants";
import { getAppConstants } from "./domain/useCases/GetAppConstants";

type AppConstantsState = {
    Appconstants: AppConstants;
    loading: boolean;
    fetchConstants: () => Promise<void>;
};

export const useConstantsStore = create<AppConstantsState>((set) => ({
    Appconstants: {
        OliveVarieties: [],
        PurchaseStatuses: [],
        SampleStatuses: [],
        ProductionStatuses: [],
        OilMovementTypes: [],
        InvoiceTypes: [],
        InvoiceStatuses: [],
        PaymentMethods: [],
    },
    loading: false,

    fetchConstants: async () => {
        set({ loading: true });

        try {
            const data = await getAppConstants();

            set({
                Appconstants: data,
            });
        } finally {
            set({ loading: false });
        }
    },
}));