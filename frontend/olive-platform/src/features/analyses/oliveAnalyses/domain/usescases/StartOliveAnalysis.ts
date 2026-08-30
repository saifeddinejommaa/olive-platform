import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";

export async function startOliveAnalysis(id: number) : Promise<void>  {
   await OliveAnalysesRepository.start(id);
}