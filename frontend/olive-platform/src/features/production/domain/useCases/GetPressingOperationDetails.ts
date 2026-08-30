import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";

export const GetPressingOperationDetails = async (operationId: number) => {
  const employees =
    await PressingOperationRepository.getPressingOperationDetails(operationId);

  return employees;
};
