import { create } from 'zustand'

import type { Harvest } from '../../domain/entities/Harvest'
import type { HarvestStock } from '../../domain/entities/HarvestStock'
import type { UpdateHarvestParams } from '../../domain/params/UpdateHarvestParams'

import { getHarvest } from '../../domain/usecases/GetHarvest'
import { updateHarvest } from '../../domain/usecases/UpdateHarvest'
import { startHarvest } from '../../domain/usecases/StartHarvest'
import { completeHarvest } from '../../domain/usecases/CompleteHarvest'
import { cancelHarvest } from '../../domain/usecases/CancelHarvest'
import type { HarvestStockParams } from '../../domain/params/HarvestStockParams'
import type { CompleteHarvestParams } from '../../domain/params/CompleteHarvestParams'

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
    completeDate: string,
    stocks: HarvestStockParams[],
  ) => Promise<void>

  cancel: (id: number) => Promise<void>

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
      completeDate,
      stocks,
    ) => {
      try {
        set({
          saving: true,
          error: null,
        })

        console.log()
        const params: CompleteHarvestParams = {
          quantityKg: quantityKg,
          harvestedTrees: harvestedTrees,
          completeDate: completeDate,
          stocks: stocks,
        }

         await completeHarvest(
          id,
          params
        )

        set({
          saving: false,
          loading: false
        })

        
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

        await cancelHarvest(id)

        set({
           saving: false,
          loading: false
        })

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