import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { CreatePressingOperationParams } from "../params/CreatePressingOperationParams";

export const CreatePressingOperation = async (data: CreatePressingOperationParams) => {
    const result = await PressingOperationRepository.createPressingOperation(data);
    return result;
}