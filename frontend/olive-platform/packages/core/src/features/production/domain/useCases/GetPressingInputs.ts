import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";

export const GetPressingInputs = async (operationId: number) => {
  const result =
    await PressingOperationRepository.getPressingOperationInputs(operationId);
  return result;
};
