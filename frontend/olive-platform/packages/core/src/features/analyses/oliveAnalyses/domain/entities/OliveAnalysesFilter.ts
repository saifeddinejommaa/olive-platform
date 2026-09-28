import type { PaginationFilter } from "../../../../../core/PaginationFilter";
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OliveAnalysesFilters = PaginationFilter & {
  reference?: string;

  plotReference?: string;

  purchaseReference?: string;

  harvestReference?: string;

  // Du : début de l'analyse (start_time) ; Au : fin (end_time). Format "YYYY-MM-DD".
  fromDate?: string;

  toDate?: string;

  status?: ProductionStatus | null;
};
