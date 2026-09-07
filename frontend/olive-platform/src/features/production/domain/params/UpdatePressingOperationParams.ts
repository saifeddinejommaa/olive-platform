import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams";

export type UpdatePressingOperationParams = {
  id: number;

  startTime: string | null;

  endTime: string | null;

  oliveQuantityKg: number | null;

  oilQuantityLiters: number | null;

  notes: string | null;

  inputs: CreatePressingOperationInputParams[];
};
