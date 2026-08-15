export type PressingOperationResponse = {
  id: number
  pressingNumber: string
  pressingDate: string
  startTime: string | null
  endTime: string | null
  status: string

  oilQuantityLiters: number | null
  yieldPercentage: number | null

  harvestNumber: string | null
  purchaseNumber: string | null
}