import { create } from "zustand";

import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";
import { GetPressingInputs } from "../../domain/useCases/GetPressingInputs";

type PressingOperationInputsState = {
  operationId: number | null;
  inputs: PressingOperationInputDetails[];
  originalInputs: PressingOperationInputDetails[];

  loading: boolean;
  error: string | null;

  fetchInputs: (operationId: number) => Promise<void>;

  // Mutations locales, appliquées avant l'enregistrement (le
  // formulaire d'édition ne persiste rien tant que l'utilisateur
  // ne clique pas sur "Enregistrer").
  addInput: (input: PressingOperationInputDetails) => void;
  removeInput: (inputId: number) => void;
  updateInputQuantity: (inputId: number, quantityKg: number) => void;

  // Annule les mutations locales non enregistrées.
  resetToOriginal: () => void;

  clear: () => void;
};

export const usePressingOperationInputsStore =
  create<PressingOperationInputsState>((set, get) => ({
    operationId: null,
    inputs: [],
    originalInputs: [],
    loading: false,
    error: null,

    fetchInputs: async (operationId: number) => {
      // On évite un refetch si les inputs de cette opération
      // sont déjà chargés (page et tab peuvent toutes deux le
      // déclencher au montage sans dupliquer l'appel réseau).
      if (get().operationId === operationId && get().inputs.length > 0) {
        return;
      }

      set({ loading: true, error: null });

      try {
        const inputs = await GetPressingInputs(operationId);

        set({ inputs, originalInputs: inputs, operationId, error: null });
      } catch (error) {
        set({
          inputs: [],
          originalInputs: [],
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger les olives de l'opération.",
        });
      } finally {
        set({ loading: false });
      }
    },

    addInput: (input) => {
      set((state) => ({ inputs: [...state.inputs, input] }));
    },

    removeInput: (inputId) => {
      set((state) => ({
        inputs: state.inputs.filter((input) => input.id !== inputId),
      }));
    },

    updateInputQuantity: (inputId, quantityKg) => {
      set((state) => ({
        inputs: state.inputs.map((input) =>
          input.id === inputId ? { ...input, quantityKg } : input,
        ),
      }));
    },

    resetToOriginal: () => {
      set((state) => ({ inputs: state.originalInputs }));
    },

    clear: () => {
      set({
        operationId: null,
        inputs: [],
        originalInputs: [],
        loading: false,
        error: null,
      });
    },
  }));
