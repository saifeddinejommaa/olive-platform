import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";

export async function cancelOliveAnalysis(id: number) : Promise<void> {
  await OliveAnalysesRepository.cancel(id);
}