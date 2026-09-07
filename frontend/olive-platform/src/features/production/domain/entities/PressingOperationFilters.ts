import type { PaginationFilter } from "../../../../core/PaginationFilter";

export type PressingOperationFilters = PaginationFilter & {
  operationNumber?: string;
  pressingDate?: string;
  harvestNumber?: string;
  purchaseNumber?: string;
};
