import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { StartPressingOperationRequest } from "../../data/requests/StartPressingOperationRequest";

export const StartPressingOperation = async (
  request: StartPressingOperationRequest,
) => {
  return await PressingOperationRepository.startPressingOperation(request);
};
