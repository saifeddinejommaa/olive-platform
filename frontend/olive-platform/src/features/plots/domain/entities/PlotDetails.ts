import type { PlotVarietyDetail } from "./PlotVarietyDetail";

export interface PlotDetails {
  id: number;
  reference: string;
  name: string;
  areaHectares: number | null;
  numberOfTrees: number;
  plantingYear: number | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  harvestedTreesPercentage: number;
  plannedTreesPercentage: number;
  canLaunchHarvest: boolean;
  varieties: PlotVarietyDetail[]
}