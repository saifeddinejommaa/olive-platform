
import type { PurchaseStatus } from './PurchaseStatus'

export type OlivePurchase = {
  id: number

  purchaseNumber: string

  supplierName: string

  purchaseDate: string

  status: PurchaseStatus | null

  notes: string | null
}