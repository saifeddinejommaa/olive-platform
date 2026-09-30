import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";
import type { HarvestCostSummary } from "./HarvestCostSummary";
import type { HarvestStartWeather } from "./HarvestStartWeather";

export interface HarvestDetails {
  id: number;

  reference: string;

  plotId: number;

  plotReference: string;

  harvestType: number;

  variety: OliveVarieties;

  seasonId: number;

  harvestedTrees: number;

  plannedTrees: number;

  plannedDate: string;

  quantityKg: number | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string | null;

  status: ProductionStatus;
  // Récolte terminée avec des lots restant à presser.
  canBePressed: boolean;

  startTime: string | null;

  endTime: string | null;

  costs: HarvestCostSummary[];

  // Météo au lancement (null tant que la récolte n'est pas lancée).
  startWeather: HarvestStartWeather | null;
}