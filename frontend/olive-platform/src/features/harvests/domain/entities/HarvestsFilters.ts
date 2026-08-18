import type { PaginationFilter } from "../../../../core/PaginationFilter"

export type HarvestFilters = PaginationFilter & {
    harvestNumber?: string
    plotId?: number
    fromDate?: Date
    toDate?: Date
    qualityGrade?: string
}