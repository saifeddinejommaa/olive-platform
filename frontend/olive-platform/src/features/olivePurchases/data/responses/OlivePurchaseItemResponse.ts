
export type OlivePurchaseItemResponse = {
  id: number

  reference: string

  purchaseId: number

  varietyId: number | null

  description: string | null

  agreedQuantityKg: number

  pressedQuantityKg: number

  remainingQuantityKg: number

  pricePerKg: number

  totalAmount: number | null

  notes: string | null
}