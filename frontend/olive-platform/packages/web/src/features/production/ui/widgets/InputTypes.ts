import type { InputSourceType } from "@olive-platform/core/features/production/domain/entities/InputSourceType";

// Re-exported so the UI keeps a single import source for its form types.
export type { InputSourceType };

export type PressingOperationInput = {
  id: string;

  sourceType: InputSourceType;

  harvestId: number | null;

  purchaseItemId: number | null;

  reference: string;

  quantityKg: string;

  notes: string;
};

export type PressingOperationInputField = keyof PressingOperationInput;

export type PressingOperationInputUpdate = (
  id: string,
  field: PressingOperationInputField,
  value: string | number | null,
) => void;
