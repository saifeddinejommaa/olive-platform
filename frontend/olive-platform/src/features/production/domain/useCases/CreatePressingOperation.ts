import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { CreatePressingOperationParams } from "../params/CreatePressingOperationParams";

export const CreatePressingOperation = async (
  data: CreatePressingOperationParams,
) => {
    await PressingOperationRepository.createPressingOperation(data);
};
