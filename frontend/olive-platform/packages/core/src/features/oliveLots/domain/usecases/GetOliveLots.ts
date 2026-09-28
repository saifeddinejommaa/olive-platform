import { OliveLotRepository } from "../../data/repositories/OliveLotRepository";
import type { OliveLot, OliveLotsFilter } from "../entities/OliveLot";

export async function GetOliveLots(filter?: OliveLotsFilter): Promise<OliveLot[]> {
  return await OliveLotRepository.getLots(filter);
}
