import type { PaginationFilter } from "../../../../../core/PaginationFilter";
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OilAnalysesFilter = PaginationFilter & {
  reference?: string;
  // Référence de l'opération de pression source.
  pressingReference?: string;
  // Du : début de l'analyse (start_time) ; Au : fin (end_time). Format "YYYY-MM-DD".
  fromDate?: string;
  toDate?: string;
  status?: ProductionStatus;
};
