export const PressingOperationInputStatus = {
  Reserved: 0,
  Consumed: 1,
  Released: 2,
} as const

export type PressingOperationInputStatus =
  typeof PressingOperationInputStatus[keyof typeof PressingOperationInputStatus]