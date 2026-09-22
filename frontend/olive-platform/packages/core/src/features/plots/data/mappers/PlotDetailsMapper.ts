// src/features/production/plots/data/mappers/PlotMapper.ts

import type { PlotDetails } from "../../domain/entities/PlotDetails";
import type { PlotDetailsResponse } from "../responses/PlotDetailsResponse";
import { PlotVarietiesDetaitsMapper } from "./PlotVarietiesDetaitsMapper";



export function PlotDetailsMapper(
  response: PlotDetailsResponse
): PlotDetails {
  return {
    id: response.id,
    reference: response.reference,
    name: response.name,
    areaHectares: response.areaHectares,
    numberOfTrees: response.numberOfTrees,
    plantingYear: response.plantingYear,
    location: response.location,
    notes: response.notes,
    createdAt: response.createdAt,
    harvestedTreesPercentage: response.harvestedTreesPercentage,
    canLaunchHarvest: response.canLaunchHarvest,
    plannedTreesPercentage: response.plannedTreesPercentage,
    varieties: response.varieties.map(PlotVarietiesDetaitsMapper)
  };
}