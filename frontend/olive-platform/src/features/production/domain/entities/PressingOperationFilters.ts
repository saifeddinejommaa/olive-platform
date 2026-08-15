import type { PaginationFilter } from "../../../../core/PaginationFilter"

export type PressingOperationFilters = PaginationFilter & {
  pressingNumber: string
  pressingDate: string
  harvestNumber: string
  purchaseNumber: string
}