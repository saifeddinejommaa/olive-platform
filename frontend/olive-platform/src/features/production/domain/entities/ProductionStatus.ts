export const ProductionStatus = {
  Planned : 1,
  InProgress : 2,
  Completed : 3,
  Cancelled : 4,
} as const

export type ProductionStatus =
  typeof ProductionStatus[keyof typeof ProductionStatus]