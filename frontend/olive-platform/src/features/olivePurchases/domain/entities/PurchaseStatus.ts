export const PurchaseStatus = {
  Draft: 1,
  Pending: 2,
  Approved: 3,
  Received: 4,
  Cancelled: 5,
} as const

export type PurchaseStatus =
  typeof PurchaseStatus[keyof typeof PurchaseStatus]