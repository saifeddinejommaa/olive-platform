import { create } from 'zustand'

import type { Harvest } from '../../domain/entities/Harvest'
import type { UpdateHarvestParams } from '../../domain/params/UpdateHarvestParams'

import { getHarvest } from '../../domain/usecases/GetHarvest'
import { updateHarvest } from '../../domain/usecases/UpdateHarvest'
import { startHarvest } from '../../domain/usecases/StartHarvest'
import { completeHarvest } from '../../domain/usecases/CompleteHarvest'
import { cancelHarvest } from '../../domain/usecases/CancelHarvest'

type HarvestDetailsState = {
  harvest: Harvest | null
  loading: boolean
  saving: boolean
  error: string | null

  fetchHarvest: (id: number) => Promise<void>

  update: (
    id: number,
    params: UpdateHarvestParams,
  ) => Promise<Harvest>

  start: (id: number) => Promise<void>

  complete: (
    id: number,
    quantityKg: number,
    harvestedTrees: number,
    completeDate: string
  ) => Promise<Harvest>

  cancel: (id: number) => Promise<Harvest>

  clear: () => void
}

export const useHarvestDetailsStore =
  create<HarvestDetailsState>((set) => ({
    harvest: null,
    loading: false,
    saving: false,
    error: null,

    fetchHarvest: async (id) => {
      try {
        set({
          loading: true,
          error: null,
        })

        const harvest = await getHarvest(id)

        set({
          harvest,
        })
      } catch (error) {
        console.error(error)

        set({
          error: 'Impossible de charger la récolte.',
        })

        throw error
      } finally {
        set({
          loading: false,
        })
      }
    },

    update: async (id, params) => {
      try {
        set({
          saving: true,
          error: null,
        })

        const harvest = await updateHarvest(id, params)

        set({
          harvest,
        })

        return harvest
      } catch (error) {
        console.error(error)

        set({
          error: 'Impossible de modifier la récolte.',
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    start: async (id) => {
      try {
        set({
          saving: true,
          error: null,
        })

        // Le backend retourne 204 No Content
        await startHarvest(id)

        // On recharge la récolte pour récupérer
        // le nouveau statut InProgress
        const harvest = await getHarvest(id)

        set({
          harvest,
        })
      } catch (error) {
        console.error(error)

        set({
          error: 'Impossible de lancer la récolte.',
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    complete: async (
      id,
      quantityKg,
      harvestedTrees,
    ) => {
      try {
        set({
          saving: true,
          error: null,
        })

        const harvest = await completeHarvest(
          id,
          quantityKg,
          harvestedTrees,
        )

        set({
          harvest,
        })

        return harvest
      } catch (error) {
        console.error(error)

        set({
          error: 'Impossible de clôturer la récolte.',
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    cancel: async (id) => {
      try {
        set({
          saving: true,
          error: null,
        })

        const harvest = await cancelHarvest(id)

        set({
          harvest,
        })

        return harvest
      } catch (error) {
        console.error(error)

        set({
          error: "Impossible d'annuler la récolte.",
        })

        throw error
      } finally {
        set({
          saving: false,
        })
      }
    },

    clear: () => {
      set({
        harvest: null,
        loading: false,
        saving: false,
        error: null,
      })
    },
  }))