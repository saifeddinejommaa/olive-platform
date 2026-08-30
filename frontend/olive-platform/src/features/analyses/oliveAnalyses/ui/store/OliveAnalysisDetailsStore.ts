import { create } from 'zustand'

import type { OliveAnalysisDetails } from '../../domain/entities/OliveAnalysisDetails'
import type { UpdateOliveAnalysisParams } from '../../domain/params/UpdateOliveAnalysisParams'

import { getOliveAnalysisDetails } from '../../domain/usescases/GetOliveAnalysisDetails'
import { updateOliveAnalysis } from '../../domain/usescases/UpdateOliveAnalysis'
import { startOliveAnalysis } from '../../domain/usescases/StartOliveAnalysis'
import { cancelOliveAnalysis } from '../../domain/usescases/CancelOliveAnalysis'

type OliveAnalysisDetailsState = {
  analysis: OliveAnalysisDetails | null

  loading: boolean

  saving: boolean

  error: string | null

  fetchAnalysis: (
    id: number,
  ) => Promise<void>

  update: (
    id: number,
    params: UpdateOliveAnalysisParams,
  ) => Promise<OliveAnalysisDetails>

  start: (
    id: number,
  ) => Promise<void>

  complete: (
    id: number,
    params: UpdateOliveAnalysisParams,
  ) => Promise<OliveAnalysisDetails>

  cancel: (
    id: number,
  ) => Promise<OliveAnalysisDetails>

  clear: () => void
}

export const useOliveAnalysisDetailsStore =
  create<OliveAnalysisDetailsState>((set) => ({
    // ============================================================
    // STATE
    // ============================================================

    analysis: null,

    loading: false,

    saving: false,

    error: null,

    // ============================================================
    // GET DETAILS
    // ============================================================

    fetchAnalysis: async (id) => {
      try {
        set({
          loading: true,
          error: null,
        })

        const analysis =
          await getOliveAnalysisDetails(id)

        set({
          analysis,
        })
      } catch (error) {
        console.error(error)

        set({
          error:
            "Impossible de charger l'analyse d'olive.",
        })

        throw error
      } finally {
        set({
          loading: false,
        })
      }
    },

    // ============================================================
    // UPDATE
    // ============================================================

    update: async (id, params) => {
      try {
        set({
          saving: true,
          error: null,
        })

        const analysis =
          await updateOliveAnalysis(
            id,
            params,
          )

        set({
          analysis,
        })

        return analysis
      } catch (error) {
        console.error(error)

        set({
          error:
            "Impossible de modifier l'analyse d'olive.",
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    // ============================================================
    // START
    // ============================================================

    start: async (id) => {
      try {
        set({
          saving: true,
          error: null,
        })

        await startOliveAnalysis(id)

        const analysis =
          await getOliveAnalysisDetails(id)

        set({
          analysis,
        })
      } catch (error) {
        console.error(error)

        set({
          error:
            "Impossible de démarrer l'analyse d'olive.",
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    // ============================================================
    // COMPLETE / CLOSE
    // ============================================================

    complete: async (id, params) => {
      try {
        set({
          saving: true,
          error: null,
        })

        await updateOliveAnalysis(
          id,
          params,
        )

        const analysis =
          await getOliveAnalysisDetails(id)

        set({
          analysis,
        })

        return analysis
      } catch (error) {
        console.error(error)

        set({
          error:
            "Impossible de clôturer l'analyse d'olive.",
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    // ============================================================
    // CANCEL
    // ============================================================

    cancel: async (id) => {
      try {
        set({
          saving: true,
          error: null,
        })

        await cancelOliveAnalysis(id)

        const analysis =
          await getOliveAnalysisDetails(id)

        set({
          analysis,
        })

        return analysis
      } catch (error) {
        console.error(error)

        set({
          error:
            "Impossible d'annuler l'analyse d'olive.",
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    // ============================================================
    // CLEAR
    // ============================================================

    clear: () => {
      set({
        analysis: null,
        loading: false,
        saving: false,
        error: null,
      })
    },
  }))

