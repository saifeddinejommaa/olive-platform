import type { PaginationFilter } from "../../../../core/PaginationFilter";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";
import type { PlotHarvestState } from "./PlotHarvestState";

export type PlotsRequestFilter = PaginationFilter & {
  reference?: string;
  name?: string;
  oliveVariety?: OliveVarieties;
  // Calculé sur la campagne sélectionnée.
  harvestState?: PlotHarvestState | null;
};
