import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams"

export type CreatePressingOperationParams = {
  operationReference: string

  createdAt: string,

  startTime: string | null

  endTime: string | null

  status: number

  oliveQuantityKg: number | null

  oilQuantityLiters: number | null

  notes: string | null

  inputs: CreatePressingOperationInputParams[]
}