import { SeasonsRepository } from "../../data/repositories/SeasonsRepository";

export const GetSeasons = async () => {
  return SeasonsRepository.getAll();
};
