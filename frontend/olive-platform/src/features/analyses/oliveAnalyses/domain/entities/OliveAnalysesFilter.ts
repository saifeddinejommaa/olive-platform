import type { PaginationFilter } from "../../../../../core/PaginationFilter"
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus"

export type OliveAnalysesFilters = PaginationFilter & {
   reference?: string

  plotReference?: string

  purchaseReference?: string

  harvestReference?: string

  analysisDate?: string

  status?: ProductionStatus
}