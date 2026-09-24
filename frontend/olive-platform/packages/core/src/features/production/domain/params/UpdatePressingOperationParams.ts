import type { CreatePressingOperationInputParams } from "./CreatePressingOperationInputParams";

export type UpdatePressingOperationParams = {
  id: number;

  planificationDate?: string;

  notes?: string | null;

  inputs?: CreatePressingOperationInputParams[];
};
