import { create } from "zustand";

import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";

import { GetPressingOperationDetails } from "../../domain/useCases/GetPressingOperationDetails";
import { UpdatePressingOperation } from "../../domain/useCases/UpdatePressingOperation";
import { StartPressingOperation } from "../../domain/useCases/StartPressingOperation";
import { CancelPressingOperation } from "../../domain/useCases/CancelPressingOperation";
import { ClosePressingOperation } from "../../domain/useCases/ClosePressingOperation ";
import type { UpdatePressingOperationParams } from "../../domain/params/UpdatePressingOperationParams";
import type { CompletePressingOperationParams } from "../../domain/params/CompletePressingOperationParams";

type PressingOperationDetailsState = {
  operation: PressingOperationDetails | null;

  loading: boolean;
  saving: boolean;
  starting: boolean;
  completing: boolean;
  cancelling: boolean;

  error: string | null;

  fetchOperation: (id: number) => Promise<void>;

  updateOperation: (operation: UpdatePressingOperationParams) => Promise<void>;

  startOperation: (id: number) => Promise<void>;

  completeOperation: (params: CompletePressingOperationParams) => Promise<void>;

  cancelOperation: (id: number) => Promise<void>;

  clear: () => void;
};

export const usePressingOperationDetailsStore =
  create<PressingOperationDetailsState>((set, get) => ({
    operation: null,

    loading: false,
    saving: false,
    starting: false,
    completing: false,
    cancelling: false,

    error: null,

    // ============================================================
    // GET DETAILS
    // ============================================================

    fetchOperation: async (id: number) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const result = await GetPressingOperationDetails(id);

        if (result.Code !== 200) {
          set({
            error: result.ResponseMessage,
            operation: null,
          });

          return;
        }

        set({
          operation: result.Response,
          error: null,
        });
      } catch (error) {
        set({
          operation: null,
          error:
            error instanceof Error ? error.message : "Une erreur est survenue.",
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    // ============================================================
    // UPDATE
    // ============================================================

    updateOperation: async (params: UpdatePressingOperationParams) => {
      set({
        saving: true,
        error: null,
      });

      try {
        const result = await UpdatePressingOperation(params);

        if (result.Code !== 200) {
          set({
            error: result.ResponseMessage,
          });

          throw new Error(result.ResponseMessage);
        }

        // On recharge les détails pour avoir la
        // représentation complète de l'opération.
        await get().fetchOperation(params.id);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Impossible d’enregistrer les modifications.",
        });

        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    // ============================================================
    // START
    // ============================================================

    startOperation: async (id) => {
      set({
        starting: true,
        error: null,
      });

      try {
        const result = await StartPressingOperation(id, {
          startDate: new Date().toISOString(),
        });

        if (result.Code !== 200) {
          set({
            error: result.ResponseMessage,
          });

          throw new Error(result.ResponseMessage);
        }

        await get().fetchOperation(id);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Impossible de lancer la pression.",
        });

        throw error;
      } finally {
        set({
          starting: false,
        });
      }
    },

    // ============================================================
    // CLOSE
    // ============================================================

    completeOperation: async (params: CompletePressingOperationParams) => {
      set({
        completing: true,
        error: null,
      });

      try {
        const result = await ClosePressingOperation(params.id, {
          endDate: params.endDate,
          oilQuantity: params.oliveQuantity,
        });

        if (result.Code !== 200) {
          set({
            error: result.ResponseMessage,
          });

          throw new Error(result.ResponseMessage);
        }

        // L'endpoint close retourne seulement l'ID.
        // On recharge donc l'opération.
        await get().fetchOperation(params.id);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Impossible de clôturer la pression.",
        });

        throw error;
      } finally {
        set({
          completing: false,
        });
      }
    },

    // ============================================================
    // CANCEL
    // ============================================================

    cancelOperation: async (id) => {
      set({
        cancelling: true,
        error: null,
      });

      try {
        const result = await CancelPressingOperation(id);

        if (result.Code !== 200 || result.Response !== true) {
          set({
            error: result.ResponseMessage,
          });

          throw new Error(result.ResponseMessage);
        }

        // L'endpoint cancel retourne seulement bool.
        // On recharge donc l'opération.
        await get().fetchOperation(id);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Impossible d’abandonner la pression.",
        });

        throw error;
      } finally {
        set({
          cancelling: false,
        });
      }
    },

    // ============================================================
    // CLEAR
    // ============================================================

    clear: () => {
      set({
        operation: null,
        loading: false,
        saving: false,
        starting: false,
        completing: false,
        cancelling: false,
        error: null,
      });
    },
  }));
