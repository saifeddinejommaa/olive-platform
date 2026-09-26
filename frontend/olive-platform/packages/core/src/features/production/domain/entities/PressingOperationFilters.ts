import type { PaginationFilter } from "../../../../core/PaginationFilter";

export type PressingOperationFilters = PaginationFilter & {
  operationNumber?: string;
  plannedDate?: string;
  harvestNumber?: string;
  purchaseNumber?: string;
};
