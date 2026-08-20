import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'

import SourceReference, {
    type SourceOption,
} from './SourceReference'

import SourceTypeSelector from './SourceTypeSelector'

import type {
    PressingOperationInput,
    InputSourceType,
} from './InputTypes'

// ============================================================
// TYPES
// ============================================================

type PressingOperationInputItemProps = {
    input: PressingOperationInput

    index: number

    errors: Record<string, string>

    onRemove: (
        id: string
    ) => void

    onUpdate: (
        id: string,
        field: keyof PressingOperationInput,
        value: string | number | null
    ) => void

    onChangeSource: (
        id: string,
        sourceType: InputSourceType
    ) => void

    onSelectSource: (
        id: string,
        source: SourceOption
    ) => void
}

// ============================================================
// COMPONENT
// ============================================================

export default function PressingOperationInputItem({
    input,
    index,
    errors,
    onRemove,
    onUpdate,
    onChangeSource,
    onSelectSource,
}: PressingOperationInputItemProps) {

    // ==========================================================
    // CHANGE SOURCE
    // ==========================================================

   const handleChangeSource = (
    sourceType: InputSourceType
) => {

    // Changement de source :
    // on efface toutes les anciennes références.

    onUpdate(
        input.id,
        'reference',
        ''
    )

    onUpdate(
        input.id,
        'harvestId',
        null
    )

    onUpdate(
        input.id,
        'purchaseItemId',
        null
    )

    // IMPORTANT :
    // on remet la quantité à zéro.
    onUpdate(
        input.id,
        'quantityKg',
        0
    )

    // Enfin on change le type de source.
    onChangeSource(
        input.id,
        sourceType
    )
}

    // ==========================================================
    // REFERENCE CHANGE
    // ==========================================================

    const handleReferenceChange = (
        value: string
    ) => {

        onUpdate(
            input.id,
            'reference',
            value
        )

        if (
            input.sourceType === 'harvest'
        ) {

            onUpdate(
                input.id,
                'harvestId',
                null
            )

            onUpdate(
                input.id,
                'purchaseItemId',
                null
            )

        } else {

            onUpdate(
                input.id,
                'purchaseItemId',
                null
            )

        }
    }

    // ==========================================================
    // SOURCE SELECTION
    // ==========================================================

    const handleSelectSource = (
        source: SourceOption
    ) => {

        onSelectSource(
            input.id,
            source
        )

        // ======================================================
        // AUTOMATIC QUANTITY
        // ======================================================

        if (
            source.quantityKg !== undefined
        ) {

            onUpdate(
                input.id,
                'quantityKg',
                source.quantityKg
            )

        }

    }

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <div
            style={{
                gridColumn: '1 / -1',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >

            {/* ==================================================
                SOURCE TYPE
            ================================================== */}

            <SourceTypeSelector
                value={
                    input.sourceType
                }
                onChange={
                    handleChangeSource
                }
            />

            {/* ==================================================
                SOURCE REFERENCE
            ================================================== */}

            <SourceReference
                sourceType={
                    input.sourceType
                }

                value={
                    input.reference
                }

                error={
                    errors[
                        `input-${index}`
                    ]
                }

                onChange={
                    handleReferenceChange
                }

                onSelect={
                    handleSelectSource
                }
            />

            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div>

                <TextInput
                    label="Quantité d'olives (kg)"
                    type="number"
                    placeholder="500"
                    value={
                        input.quantityKg
                    }
                    onChange={(
                        event
                    ) =>
                        onUpdate(
                            input.id,
                            'quantityKg',
                            event.target.value
                        )
                    }
                />

                {errors[
                    `quantity-${index}`
                ] && (

                    <span
                        className="field-error"
                    >
                        {
                            errors[
                                `quantity-${index}`
                            ]
                        }
                    </span>

                )}

            </div>

            {/* ==================================================
                REMOVE
            ================================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '4px',
                }}
            >

                <Button
                    variant="secondary"
                    onClick={() =>
                        onRemove(
                            input.id
                        )
                    }
                >
                    Supprimer
                </Button>

            </div>

        </div>
    )
}