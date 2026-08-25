import type { PaginationFilter } from "../../../../core/PaginationFilter"

export type PlotsFilter =
  PaginationFilter & {
    reference?: string
    name?: string
  }