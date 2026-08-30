import { useState } from 'react'
import type { CreateHarvestParams } from '../../domain/params/CreateHarvestParams'
import { createHarvestUseCase } from '../../domain/usecases/CreateHarvest'

export function useCreateHarvest() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createHarvestAction = async (params: CreateHarvestParams): Promise<number | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await createHarvestUseCase(params)
      return data.Response
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Une erreur est survenue lors de la création de la récolte.'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createHarvestAction,
    isLoading,
    error,
  }
}