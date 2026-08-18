export type ProductionStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PressingOperation = {
  id: number

  operationNumber: string

  pressingDate: string

  startTime: string | null
  endTime: string | null

  status: ProductionStatus

  oilQuantityLiters: number | null

  yieldPercentage: number | null
}