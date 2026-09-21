import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams";

export type CreatePressingOperationParams = {
  createdAt: string;

  startTime: string | null;

  endTime: string | null;

  status: number;

  oliveQuantityKg: number | null;

  oilQuantityLiters: number | null;

  notes: string | null;

  inputs: CreatePressingOperationInputParams[];
};
