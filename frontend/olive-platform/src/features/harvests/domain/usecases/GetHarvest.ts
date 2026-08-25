import { HarvestRepository } from '../../data/repositories/HarvestRepository'
import type { Harvest } from '../entities/Harvest'

export async function getHarvest(id: number): Promise<Harvest> {
  return await HarvestRepository.getById(id)
}