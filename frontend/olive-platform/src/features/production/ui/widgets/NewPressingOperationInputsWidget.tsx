import PressingOperationInputsHeader from './PressingOperationInputsHeader'
import PressingOperationInputItem from './PressingOperationInputItem'
import PressingOperationInputsEmptyState from './PressingOperationInputsEmptyState'
import PressingOperationInputsSummary from './PressingOperationInputsSummary'
import PressingOperationInputsFooter from './PressingOperationInputsFooter'

import type {
  PressingOperationInput,
  InputSourceType,
  PressingOperationInputUpdate,
} from './InputTypes'

import type { SourceOption } from './SourceReference'

// ============================================================
// TYPES
// ============================================================

type NewPressingOperationInputsWidgetProps = {
  inputs: PressingOperationInput[]

  errors: Record<string, string>

  onAdd?: () => void

  onRemove?: (
    id: string
  ) => void

  onUpdate: PressingOperationInputUpdate

  onChangeSource: (
    id: string,
    sourceType: InputSourceType
  ) => void

  onSelectSource: (
    id: string,
    source: SourceOption
  ) => void

  showAddButton?: boolean
}

// ============================================================
// COMPONENT
// ============================================================

export default function NewPressingOperationInputsWidget({
  inputs,
  errors,
  onAdd,
  onUpdate,
  onChangeSource,
  onSelectSource,
  showAddButton = true,
}: NewPressingOperationInputsWidgetProps) {

  return (
    <div className="filters">

      <PressingOperationInputsHeader />

      <div className="filters-content">

        {inputs.length === 0 && (
          <PressingOperationInputsEmptyState />
        )}

        {inputs.map((input, index) => (
          <PressingOperationInputItem
            key={input.id}
            input={input}
            index={index}
            errors={errors}
            onUpdate={onUpdate}
            onChangeSource={onChangeSource}
            onSelectSource={onSelectSource}
          />
        ))}

        {errors.inputs && (
          <div
            className="field-error"
            style={{
              gridColumn: '1 / -1',
            }}
          >
            {errors.inputs}
          </div>
        )}

        <PressingOperationInputsSummary
          inputs={inputs}
        />

        {showAddButton && onAdd && (
          <PressingOperationInputsFooter
            onAdd={onAdd}
          />
        )}

      </div>

    </div>
  )
}