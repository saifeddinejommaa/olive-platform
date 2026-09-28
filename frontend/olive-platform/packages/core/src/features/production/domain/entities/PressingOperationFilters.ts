import type { PaginationFilter } from "../../../../core/PaginationFilter";

export type PressingOperationFilters = PaginationFilter & {
  operationNumber?: string;
  // Du : début de la pression (start_time) ; Au : fin (end_time). Format "YYYY-MM-DD".
  fromDate?: string;
  toDate?: string;
  harvestNumber?: string;
  purchaseNumber?: string;
};
