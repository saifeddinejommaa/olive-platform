import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { ClosePressingOperationRequest } from "../../data/requests/ClosePressingOperationRequest";

export const ClosePressingOperation = async (
  id: number,
  request: ClosePressingOperationRequest,
) => {
  return await PressingOperationRepository.closePressingOperation(id, request);
};
