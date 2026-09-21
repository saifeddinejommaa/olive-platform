import type { PlotVarietyDetail } from "../../domain/entities/PlotVarietyDetail";
import type { PlotVarietyDetailResponse } from "../responses/PlotVarietyDetailResponse";

export function PlotVarietiesDetaitsMapper(
  response: PlotVarietyDetailResponse
): PlotVarietyDetail {
  return {
    varietyId: response.varietyId,
    varietyLabel: response.varietyLabel,
    numberOfTrees: response.numberOfTrees,
    remainingTreesToHarvest: response.remainingTreesToHarvest,
    harvestedPercentage: response.harvestedPercentage,
     plannedTreesPercentage: response.plannedTreesPercentage,
  };
}