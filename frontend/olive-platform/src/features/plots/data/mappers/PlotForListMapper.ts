import type { PlotForList } from "../../domain/entities/PlotForList";
import type { PlotForListResponse } from "../responses/PlotForListResponse";

export function PlotForListMapper(
  response: PlotForListResponse
): PlotForList {
  return {
    id: response.id,
    reference: response.reference,
    name: response.name,
    numberOfTrees: response.numberOfTrees,
    harvestedTreesPercentage: response.harvestedTreesPercentage,
    canLaunchHarvest: response.canLaunchHarvest,
    plannedTreesPercentage: response.plannedTreesPercentage
  };
}