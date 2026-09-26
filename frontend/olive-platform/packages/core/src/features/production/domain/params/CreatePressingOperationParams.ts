import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams";

export type CreatePressingOperationParams = {
  plannedDate: string;

  startTime: string | null;

  endTime: string | null;

  status: number;

  oliveQuantityKg: number | null;

  oilQuantityLiters: number | null;

  notes: string | null;

  inputs: CreatePressingOperationInputParams[];
};
