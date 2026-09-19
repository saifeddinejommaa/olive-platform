import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { ProcessedPayment } from "../../domain/entities/ProcessedPayment";
import type { PaymentHistoryFilter } from "../../domain/entities/PaymentHistoryFilter";
import { GetPaymentsHistory } from "../../domain/usecases/GetPaymentsHistory";

type PaymentsState = {
  payments: PagedResult<ProcessedPayment>;
  loading: boolean;
  error: string | null;
  filters: PaymentHistoryFilter;

  setFilter: <K extends keyof PaymentHistoryFilter>(
    key: K,
    value: PaymentHistoryFilter[K],
  ) => void;

  clearFilters: () => void;
  fetchPayments: () => Promise<void>;
};

export const usePaymentsHistoryStore = create<PaymentsState>(
  (set, get) => ({
    payments: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },

    loading: false,

    error: null,

    filters: {
      pageNumber: 1,
      pageSize: 10,
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

    fetchPayments: async () => {
      set({
        loading: true,
        error: null,
      });

      try {
        const result = await GetPaymentsHistory(get().filters);

        set({
          payments: result,
          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Une erreur est survenue.",
        });

        throw error;
      }
    },
  }),
);
