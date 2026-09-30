import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { HarvestCostSummary } from "../../domain/entities/HarvestCostSummary";
import type { HarvestStartWeather } from "../../domain/entities/HarvestStartWeather";

export interface HarvestDetailsResponse {
  id: number;
  reference: string;
  plotId: number;
  plotReference: string;
  varietyId: number;
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
  canBePressed?: boolean;
  startTime: string | null;
  endTime: string | null;
  oliveAnalysis?: OliveAnalysisDetailsResponse;
   costs: HarvestCostSummary[];
   harvestType: number;
  startWeather?: HarvestStartWeather | null;
}
