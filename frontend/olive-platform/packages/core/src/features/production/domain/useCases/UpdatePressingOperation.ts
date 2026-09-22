import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { UpdatePressingOperationParams } from "../params/UpdatePressingOperationParams";

export const UpdatePressingOperation = async (
  UpdatePressingOperationParams: UpdatePressingOperationParams,
) => {
  return await PressingOperationRepository.updatePressingOperation(
    UpdatePressingOperationParams,
  );
};
