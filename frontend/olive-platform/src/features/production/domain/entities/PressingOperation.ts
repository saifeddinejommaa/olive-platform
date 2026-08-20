import type { ProductionStatus } from "./ProductionStatus"

export type PressingOperation = {
  id: number

  operationNumber: string
  createdAt : Date
  startTime: Date | null
  endTime: Date | null

  status: ProductionStatus

  oilQuantityLiters: number | null

  notes : string | null
}