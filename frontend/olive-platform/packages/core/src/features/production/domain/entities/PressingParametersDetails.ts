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