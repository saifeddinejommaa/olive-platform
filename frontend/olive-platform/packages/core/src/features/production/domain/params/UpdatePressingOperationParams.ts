import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams";

// Configuration de pression (réglages du moulin), saisie pendant la pression.
export type PressingParametersParams = {
  processTypeId?: number | null;
  millId?: number | null;
  malaxingTemperatureC: number | null;
  malaxingDurationMinutes: number | null;
  malaxingSpeedRpm: number | null;
  feedRateKgH: number | null;
  decanterSpeedRpm: number | null;
  decanterDifferentialRpm: number | null;
  centrifugeSpeedRpm: number | null;
  addedWaterLiters: number | null;
  waterTemperatureC: number | null;
  waitingTimeBeforeExtractionMinutes: number | null;
  notes?: string | null;
};

export type UpdatePressingOperationParams = {
  id: number;

  plannedDate?: string;

  notes?: string | null;

  // Remplace les entrées (pression planifiée uniquement).
  inputs?: CreatePressingOperationInputParams[];

  // Crée ou met à jour la configuration (pression en cours uniquement).
  parameters?: PressingParametersParams | null;
};
