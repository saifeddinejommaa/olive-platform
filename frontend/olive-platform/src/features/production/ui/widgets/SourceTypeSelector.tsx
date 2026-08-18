import type {
  InputSourceType,
} from './InputTypes'

// ============================================================
// TYPES
// ============================================================

type SourceTypeSelectorProps = {
  value: InputSourceType

  onChange: (
    value: InputSourceType
  ) => void
}

// ============================================================
// COMPONENT
// ============================================================

export default function SourceTypeSelector({
  value,
  onChange,
}: SourceTypeSelectorProps) {

  return (
    <div>

      <label>
        Source
      </label>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginTop: '8px',
        }}
      >

        <label>

          <input
            type="radio"
            checked={
              value === 'harvest'
            }
            onChange={() =>
              onChange(
                'harvest'
              )
            }
          />

          {' '}
          Récolte

        </label>

        <label>

          <input
            type="radio"
            checked={
              value === 'purchase'
            }
            onChange={() =>
              onChange(
                'purchase'
              )
            }
          />

          {' '}
          Achat

        </label>

      </div>

    </div>
  )
}