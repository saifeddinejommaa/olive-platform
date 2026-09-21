import type { PaginationFilter } from "../../../../../core/PaginationFilter";
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OilAnalysesFilter = PaginationFilter & {
  reference?: string;
  analysisDate?: string;
  status?: ProductionStatus;
};
