import { PressingOperationRepository } from "../../data/repositories/PressingOperationRepository";
import type { PressingOperationFilters } from "../entities/PressingOperationFilters";

export const GetPressingOperations = async (
  filters?: PressingOperationFilters,
) => {
  const employees = await PressingOperationRepository.getAll(filters);

  return employees;
};
