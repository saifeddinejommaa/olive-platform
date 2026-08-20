export type PressingOperationResponse = {
  id: number
  operationNumber: string
  pressingDate: string
  createdAt:string
  startTime: string | null
  endTime: string | null
  status: string

  oilQuantityLiters: number | null

  harvestNumber: string | null
  purchaseNumber: string | null
  notes : string | null
}