import { TankRepository } from "../../data/repositories/TankRepository";
import { TankType, type Tank } from "../entities/Tank";

// Citernes tampon actives, avec leur contenu actuel.
export const GetBufferTanks = async (): Promise<Tank[]> => {
  const result = await TankRepository.getTanks({
    tankType: TankType.Buffer,
    status: "active",
    pageNumber: 1,
    pageSize: 100,
  });

  return result.items;
};
