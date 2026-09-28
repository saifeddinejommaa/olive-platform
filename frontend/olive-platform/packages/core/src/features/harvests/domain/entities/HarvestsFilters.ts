import type { PaginationFilter } from "../../../../core/PaginationFilter";
import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

export type HarvestFilters = PaginationFilter & {
  harvestNumber?: string;
  plotId?: number;
  plotReference?: string;
  status?: ProductionStatus | null;
  // Du : début de la récolte (start_time) ; Au : fin (end_time). Format "YYYY-MM-DD".
  fromDate?: string;
  toDate?: string;
  toPressing?: boolean;
};
