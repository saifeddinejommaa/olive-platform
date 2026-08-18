import { Autocomplete } from '../../../../common/widgets/autoComplete/AutoComplete'
import { useHarvestsAutocomplete } from '../../../harvests/ui/hooks/UseHarvestsAutoComplete'
import { UseOlivePurchaseAutoComplete } from '../../../olivePurchases/ui/hooks/UseOlivePurchaseAutoComplete'

import type { InputSourceType } from './InputTypes'

// ============================================================
// TYPES
// ============================================================

type SourceReferenceProps = {
  sourceType: InputSourceType

  value: string

  error?: string

  onChange: (
    value: string
  ) => void

  onSelect: (
    source: SourceOption
  ) => void
}

// ============================================================
// SOURCE OPTION
// ============================================================

export type SourceOption = {
  id: number

  reference: string
}

// ============================================================
// COMPONENT
// ============================================================

export default function SourceReference({
  sourceType,
  value,
  error,
  onChange,
  onSelect,
}: SourceReferenceProps) {

  const isHarvest =
    sourceType === 'harvest'

  return (
    <div className="filter-item">

      {isHarvest ? (

        <Autocomplete
          useSearch={
            useHarvestsAutocomplete
          }

          getLabel={(
            harvest
          ) =>
            harvest.harvestNumber
          }

          onSelect={(
            harvest
          ) => {

            onSelect({
              id:
                harvest.id,

              reference:
                harvest.harvestNumber,
            })

          }}

          placeholder="Rechercher une récolte..."

          width={400}
        />

      ) : (

        <Autocomplete
          useSearch={
            UseOlivePurchaseAutoComplete
          }

          getLabel={(
            purchase
          ) =>
            purchase.purchaseNumber
          }

          onSelect={(
            purchase
          ) => {

            onSelect({
              id:
                purchase.id,

              reference:
                purchase.purchaseNumber,
            })

          }}

          placeholder="Rechercher un achat..."

          width={400}
        />

      )}

      {error && (
        <span className="field-error">
          {error}
        </span>
      )}

    </div>
  )
}