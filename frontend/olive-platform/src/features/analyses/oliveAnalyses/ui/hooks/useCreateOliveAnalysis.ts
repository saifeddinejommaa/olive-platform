import { useState } from 'react'
import type { CreateOliveAnalysisParams } from '../../domain/params/CreateOliveAnalysisParams'

export function useCreateOliveAnalysis() {
  const [error, setError] =
    useState<string | null>(null)

  const createOliveAnalysisAction =
    async (
      params: CreateOliveAnalysisParams,
    ): Promise<boolean> => {
      try {
        setError(null)

        const response = await fetch(
          '/api/olive-analyses',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(params),
          },
        )

        if (!response.ok) {
          const message =
            await response.text()

          throw new Error(
            message ||
              "Impossible de créer l'analyse d'olive.",
          )
        }

        return true
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de créer l'analyse d'olive.",
        )

        return false
      }
    }

  return {
    createOliveAnalysisAction,
    error,
  }
}