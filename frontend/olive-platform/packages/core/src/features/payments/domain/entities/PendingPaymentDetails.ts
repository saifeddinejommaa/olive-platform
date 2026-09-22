import type { CostLineType } from "./CostLineType"
import type { PendingPaymentCostLineDetails } from "./PendingPaymentCostLineDetails"

export interface PendingPaymentDetails {
    type: CostLineType,
    details: PendingPaymentCostLineDetails[]
}