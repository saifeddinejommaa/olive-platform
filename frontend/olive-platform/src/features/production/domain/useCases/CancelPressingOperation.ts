import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository"

export const CancelPressingOperation = async (
  id: number
) => {
  return await PressingOperationRepository.cancelPressingOperation(id)
}