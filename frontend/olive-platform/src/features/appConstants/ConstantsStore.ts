import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AppConstants } from './domain/models/AppConstants'
import { getAppConstants } from './domain/useCases/GetAppConstants'

type AppConstantsState = {
  Appconstants: AppConstants
  loading: boolean
  loaded: boolean
   hydrated: boolean

  fetchConstants: () => Promise<void>
}

const initialConstants: AppConstants = {
  oliveVarieties: [],
  sampleStatuses: [],
  productionStatuses: [],
  oilMovementTypes: [],
  invoiceTypes: [],
  invoiceStatuses: [],
  paymentMethods: [],
  purchaseStatuses: [],
}

export const useConstantsStore =
  create<AppConstantsState>()(
    persist(
      (set, get) => ({
        Appconstants: initialConstants,
        loading: false,
        loaded: false,
        hydrated: false,

        fetchConstants: async () => {
          if (get().loaded || get().loading) {
            return
          }

          set({
            loading: true,
          })

          try {
            const data = await getAppConstants()

            set({
              Appconstants: data,
              loaded: true,
            })
          } finally {
            set({
              loading: false,
            })
          }
        },
      }),
      {
        name: 'olive-platform-constants',

        onRehydrateStorage: () => {
          return () => {
            useConstantsStore.setState({
              hydrated: true,
            })
          }
        },
      },
    ),
  )