export interface PressingParametersDetails {
  id: number;
  processTypeId: number | null;
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
  notes: string | null;
}
// Réglages usuels (extraction à froid, décanteur 2 phases), proposés pour
// éviter une saisie complète ; l'opérateur les ajuste avant d'enregistrer.
export const DEFAULT_PRESSING_PARAMETERS: PressingParametersDetails = {
  id: 0,
  processTypeId: null,
  malaxingTemperatureC: 27,
  malaxingDurationMinutes: 45,
  malaxingSpeedRpm: 20,
  feedRateKgH: 2000,
  decanterSpeedRpm: 3800,
  decanterDifferentialRpm: 10,
  centrifugeSpeedRpm: 6500,
  addedWaterLiters: 0,
  waterTemperatureC: 27,
  waitingTimeBeforeExtractionMinutes: 0,
  notes: null,
};
