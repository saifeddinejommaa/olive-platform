import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OliveAnalysis = {
  id: number;
  // 1 = récolte, 2 = achat (null si aucun lot rattaché).
  sourceTypeId: number | null;
  // Référence de la récolte ou du lot d'achat analysé.
  sourceReference: string | null;
  // Parcelle (récoltes uniquement).
  plotReference: string | null;
  reference: string;

  humidityPercentage?: number;
  waterPercentage?: number;
  oilPercentage?: number;
  acidityPercentage?: number;

  plannedDate?: string;

  startTime?: string;

  endTime?: string;
  status: ProductionStatus;
};
