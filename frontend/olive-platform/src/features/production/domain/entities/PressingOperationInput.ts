export type InputSourceType = 'harvest' | 'purchase'

export type PressingOperationInput = {
  id: string

  sourceType: InputSourceType

  harvestId: number | null
  purchaseItemId: number | null

  reference: string
  quantityKg: string
  notes: string
}