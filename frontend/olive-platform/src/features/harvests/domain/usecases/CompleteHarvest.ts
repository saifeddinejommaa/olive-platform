
import { HarvestRepository } from '../../data/repositories/HarvestRepository'
import type { CompleteHarvestParams } from '../params/CompleteHarvestParams'

export async function completeHarvest(
  id: number,
  params:CompleteHarvestParams,
) {
  return HarvestRepository.complete(id, params)
}