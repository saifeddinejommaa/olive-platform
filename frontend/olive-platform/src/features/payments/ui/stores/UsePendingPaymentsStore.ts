import { create } from "zustand";
import type { PagedResult } from "../../../../core/PagedResult";
import type { PendingPaymentFilter } from "../../domain/entities/PendingPaymentFilter";
import type { PendingPayment } from "../../domain/entities/PandingPayment";
import { GetPendingPayments } from "../../domain/usecases/GetPendingPayments";
import { PayPayments } from "../../domain/usecases/PayPayments";
import type { CostLineType } from "../../domain/entities/CostLineType";
import type { PaymentMethod } from "../../domain/entities/PaymentMethod";

type PaymentsState = {
  payments: PagedResult<PendingPayment>;
  loading: boolean;
  paymentsLoading: boolean;
  error: string | null;
  filters: PendingPaymentFilter;

  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  fetchPayments: () => Promise<void>;
   payPayment: (amount:number,ids: number[],sourceType:CostLineType, method: PaymentMethod) => Promise<void>;
};

export const usePendingPaymentsStore = create<PaymentsState>(
  (set, get) => ({
    payments: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },
    paymentsLoading: false,
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
        const result = await GetPendingPayments(get().filters);

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
     payPayment: async(amount:number,ids: number[], sourceType:CostLineType,method: PaymentMethod) => {
      set({
          paymentsLoading: true,
        });

        await PayPayments({amountToPay:amount,sourceIds:ids,sourceType,method: method})
     }
  }),
);