import type { PaginationFilter } from "../../../../core/PaginationFilter"
import type { PurchaseStatus } from "./PurchaseStatus"

export type OlivePurchasesFilter =
  PaginationFilter & {
    purchaseNumber?: string
    supplierName?: string
    fromDate?: string
    toDate?: string
    status?: PurchaseStatus
    toPressing?:boolean
  }