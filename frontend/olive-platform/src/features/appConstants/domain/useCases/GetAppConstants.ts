import { AppConstantsRepository } from "../../data/repositories/AppConstantsRepository";

export const getAppConstants = async () => {
  const constants = await AppConstantsRepository.getAll();
  return constants;
};