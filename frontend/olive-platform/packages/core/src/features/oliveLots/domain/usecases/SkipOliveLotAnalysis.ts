import { OliveLotRepository } from "../../data/repositories/OliveLotRepository";

export async function SkipOliveLotAnalysis(lotId: number): Promise<void> {
  await OliveLotRepository.skipAnalysis(lotId);
}
