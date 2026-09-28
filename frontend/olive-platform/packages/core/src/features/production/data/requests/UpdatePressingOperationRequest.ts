import type { CreatePressingOperationInputRequest } from "./CreatePressingOperationRequest";

export type UpdatePressingOperationRequest = {
  plannedDate?: string | null;
  notes?: string | null;
  inputs?: CreatePressingOperationInputRequest[] | null;
};
