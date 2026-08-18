
export type OlivePurchaseItem = {
  id: number

  purchaseId: number

  varietyId: number | null

  description: string | null

  agreedQuantityKg: number

  pricePerKg: number

  totalAmount: number | null

  notes: string | null
}