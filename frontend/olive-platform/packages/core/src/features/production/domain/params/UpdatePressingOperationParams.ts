import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams";

export type UpdatePressingOperationParams = {
  id: number;

  plannedDate?: string;

  notes?: string | null;

  inputs?: CreatePressingOperationInputParams[];
};
