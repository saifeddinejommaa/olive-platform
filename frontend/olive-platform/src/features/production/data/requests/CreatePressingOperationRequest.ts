export type CreatePressingOperationRequest = {
  operationReference : string,
  createdAt:string,
  startTime: string | null
  endTime: string | null
  status: number
  oliveQuantityKg: number | null
  oilQuantityLiters: number | null
  notes: string | null
  inputs: CreatePressingOperationInputRequest[]
}

export type CreatePressingOperationInputRequest = {
  harvestId: number | null
  purchaseItemId: number | null
  quantityKg: number
}