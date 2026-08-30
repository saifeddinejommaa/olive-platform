import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";

export type UpdatePressingOperationRequest = {
  planificationDate?: string | null;
  notes?: string | null;
  inputs?:
    | {
        harvestId?: number | null;
        purchaseItemId?: number | null;
        quantityKg: number;
      }[]
    | null;
};

export const UpdatePressingOperation = async (
  id: number,
  request: UpdatePressingOperationRequest,
) => {
  return await PressingOperationRepository.updatePressingOperation(id, request);
};
