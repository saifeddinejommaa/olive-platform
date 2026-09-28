import type { InputSourceType } from "@olive-platform/core/features/production/domain/entities/InputSourceType";

// Re-exported so the UI keeps a single import source for its form types.
export type { InputSourceType };

// Lot d'olives choisi (stock de récolte ou ligne d'achat) et quantité à presser.
export type LotSelection = {
  id: number;
  quantityKg: number;
  reference?: string;
};

// Source présélectionnée à l'ouverture (bouton « Lancer la pression » d'une
// récolte ou d'un achat) : ses lots pressables sont cochés automatiquement.
export type InitialSource = {
  id: number;
  reference: string;
};

export type PressingOperationInput = {
  id: string;

  initialSource?: InitialSource;

  sourceType: InputSourceType;

  harvestId: number | null;

  purchaseId: number | null;

  // Lots cochés (une entrée de pression par lot).
  lots?: LotSelection[];

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
