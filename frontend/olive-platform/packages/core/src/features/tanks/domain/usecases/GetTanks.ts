import { TankRepository } from "../../data/repositories/TankRepository";
import type { Tank, TanksFilter } from "../entities/Tank";

// Toutes les citernes correspondant au filtre (tampons d'abord).
export const GetTanks = async (filter?: TanksFilter): Promise<Tank[]> => {
  const result = await TankRepository.getTanks({
    ...filter,
    pageNumber: 1,
    pageSize: 200,
  });

  return result.items;
};
