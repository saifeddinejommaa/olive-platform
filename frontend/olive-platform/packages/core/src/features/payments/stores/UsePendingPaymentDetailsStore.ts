import { create } from "zustand";
import { GetPendingPaymentDetails } from "../domain/usecases/GetPendingPaymentDetails";
import type { CostLineType } from "../domain/entities/CostLineType";
import type { PendingPaymentDetails } from "../domain/entities/PendingPaymentDetails";

type PendingPaymentDetailsState = {
  details: PendingPaymentDetails | null;
  loading: boolean;
  error: string | null;

  fetchDetails: (
    sourceType: CostLineType,
    sourceIds: number[],
  ) => Promise<void>;

  clearDetails: () => void;
};

export const usePendingPaymentDetailsStore =
  create<PendingPaymentDetailsState>((set) => ({
    details: null,
    loading: false,
    error: null,

    fetchDetails: async (sourceType, sourceIds) => {
      set({
        loading: true,
        error: null,
        details: null,
      });

      try {
        const result = await GetPendingPaymentDetails({
          sourceType,
          sourceIds,
        });
        set({
          details: result,
          loading: false,
        });
      } catch (error: unknown) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger les détails du paiement.",
        });
      }
    },

    clearDetails: () => {
      set({
        details: null,
        loading: false,
        error: null,
      });
    },
  }));
