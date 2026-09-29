import { TankRepository } from "../../data/repositories/TankRepository";
import type { TankDetails } from "../entities/TankDetails";

export const GetTankDetails = async (id: number): Promise<TankDetails> =>
  TankRepository.getById(id);
