import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus"

export interface CreateHarvestParams {
  plotId: number
  varietyId: number
  harvestDate: string
  notes?: string | null
  status: ProductionStatus
  plannedTrees: number,
}