import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { StartPressingOperationRequest } from "../../data/requests/StartPressingOperationRequest";

export const StartPressingOperation = async (
  id: number,
  request: StartPressingOperationRequest,
) => {
  return await PressingOperationRepository.startPressingOperation(id, request);
};
