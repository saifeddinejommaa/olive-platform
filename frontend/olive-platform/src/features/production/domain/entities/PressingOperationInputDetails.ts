
export type PressingOperationInputDetails = {
  id: number
  sourceType: 'harvest' | 'purchase'
  reference: string
  quantityKg: number
  harvestId: number | null
  purchaseItemId: number | null
}