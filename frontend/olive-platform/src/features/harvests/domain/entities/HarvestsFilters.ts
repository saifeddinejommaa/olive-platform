import type { PaginationFilter } from "../../../../core/PaginationFilter";

export type HarvestFilters = PaginationFilter & {
  harvestNumber?: string;
  plotId?: number;
  fromDate?: string;
  toDate?: string;
  qualityGrade?: string;
  toPressing?: boolean;
};
