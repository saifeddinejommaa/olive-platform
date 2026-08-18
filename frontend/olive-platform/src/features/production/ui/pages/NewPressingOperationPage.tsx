import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import Button from '../../../../common/widgets/button/Button'

import TextInput from '../../../../common/widgets/textInput/TextInput'

import TextEditor from '../../../../common/widgets/textEditor/TextEditor'

import Select from '../../../../common/widgets/select/Select'

import {
  useConstantsStore,
} from '../../../appConstants/ConstantsStore'


import type {
  SourceOption,
} from '../widgets/SourceReference'
import type { InputSourceType, PressingOperationInput } from '../widgets/InputTypes'
import NewPressingOperationInputsWidget from '../widgets/NewPressingOperationInputsWidget'

// ============================================================
// TYPES
// ============================================================

type NewPressingOperationForm = {
  operationNumber: string

  pressingDate: string

  statusId: number

  notes: string

  inputs: PressingOperationInput[]
}

// ============================================================
// INITIAL FORM
// ============================================================

const initialForm:
  NewPressingOperationForm = {

  operationNumber:
    '',

  pressingDate:
    new Date()
      .toISOString()
      .split('T')[0],

  statusId:
    0,

  notes:
    '',

  inputs:
    [],
}

// ============================================================
// PAGE
// ============================================================

export default function NewPressingOperationPage() {

  const navigate =
    useNavigate()

  // ==========================================================
  // FORM
  // ==========================================================

  const [
    form,
    setForm,
  ] =
    useState<NewPressingOperationForm>(
      initialForm
    )

  const [
    errors,
    setErrors,
  ] =
    useState<
      Record<string, string>
    >({})

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  // ==========================================================
  // CONSTANTS
  // ==========================================================

  const {
    Appconstants,
    loading:
    constantsLoading,
  } =
    useConstantsStore()

  const statusOptions =
    Appconstants.productionStatuses.map(
      (status) => ({
        value:
          status.id.toString(),

        label:
          status.label,
      })
    )

  // ==========================================================
  // UPDATE FORM
  // ==========================================================

  const updateForm = <
    K extends keyof NewPressingOperationForm
  >(
    field: K,

    value:
      NewPressingOperationForm[K]
  ) => {

    setForm(
      (previous) => ({
        ...previous,

        [field]:
          value,
      })
    )

    setErrors(
      (previous) => {

        if (!previous[field]) {
          return previous
        }

        const next = {
          ...previous,
        }

        delete next[field]

        return next
      }
    )
  }

  // ==========================================================
  // ADD INPUT
  // ==========================================================

  const addInput = () => {

    const newInput:
      PressingOperationInput = {

      id:
        crypto.randomUUID(),

      sourceType:
        'harvest',

      harvestId:
        null,

      purchaseItemId:
        null,

      reference:
        '',

      quantityKg:
        '',

      notes:
        '',
    }

    setForm(
      (previous) => ({
        ...previous,

        inputs: [
          ...previous.inputs,
          newInput,
        ],
      })
    )

    setErrors(
      (previous) => {

        const next = {
          ...previous,
        }

        delete next.inputs

        return next
      }
    )
  }

  // ==========================================================
  // REMOVE INPUT
  // ==========================================================

  const removeInput = (
    id: string
  ) => {

    setForm(
      (previous) => ({
        ...previous,

        inputs:
          previous.inputs.filter(
            (input) =>
              input.id !== id
          ),
      })
    )
  }

  // ==========================================================
  // UPDATE INPUT
  // ==========================================================

  const updateInput = (
    id: string,

    field:
      keyof PressingOperationInput,

    value:
      string | number | null
  ) => {

    setForm(
      (previous) => ({
        ...previous,

        inputs:
          previous.inputs.map(
            (input) => {

              if (
                input.id !== id
              ) {
                return input
              }

              return {
                ...input,

                [field]:
                  value,
              }
            }
          ),
      })
    )

    // ----------------------------------------------
    // REMOVE FIELD ERROR
    // ----------------------------------------------

    setErrors(
      (previous) => {

        const next = {
          ...previous,
        }

        const index =
          form.inputs.findIndex(
            (input) =>
              input.id === id
          )

        if (
          index === -1
        ) {
          return previous
        }

        if (
          field ===
          'reference'
        ) {

          delete next[
            `input-${index}`
          ]
        }

        if (
          field ===
          'quantityKg'
        ) {

          delete next[
            `quantity-${index}`
          ]
        }

        return next
      }
    )
  }

  // ==========================================================
  // CHANGE SOURCE TYPE
  // ==========================================================

  const changeInputSource = (
    id: string,

    sourceType:
      InputSourceType
  ) => {

    setForm(
      (previous) => ({
        ...previous,

        inputs:
          previous.inputs.map(
            (input) => {

              if (
                input.id !== id
              ) {
                return input
              }

              return {
                ...input,

                sourceType,

                harvestId:
                  null,

                purchaseItemId:
                  null,

                reference:
                  '',
              }
            }
          ),
      })
    )

    // Remove reference error

    setErrors(
      (previous) => {

        const next = {
          ...previous,
        }

        const index =
          form.inputs.findIndex(
            (input) =>
              input.id === id
          )

        if (
          index !== -1
        ) {

          delete next[
            `input-${index}`
          ]
        }

        return next
      }
    )
  }

  // ==========================================================
  // SELECT SOURCE
  // ==========================================================

  const handleSelectSource = (
    id: string,

    source:
      SourceOption
  ) => {

    setForm(
      (previous) => ({
        ...previous,

        inputs:
          previous.inputs.map(
            (input) => {

              if (
                input.id !== id
              ) {
                return input
              }

              // --------------------------------------------
              // HARVEST
              // --------------------------------------------

              if (
                input.sourceType ===
                'harvest'
              ) {

                return {
                  ...input,

                  harvestId:
                    source.id,

                  purchaseItemId:
                    null,

                  reference:
                    source.reference,
                }
              }

              // --------------------------------------------
              // PURCHASE
              // --------------------------------------------

              return {
                ...input,

                harvestId:
                  null,

                purchaseItemId:
                  source.id,

                reference:
                  source.reference,
              }
            }
          ),
      })
    )

    // Remove reference error

    setErrors(
      (previous) => {

        const next = {
          ...previous,
        }

        const index =
          form.inputs.findIndex(
            (input) =>
              input.id === id
          )

        if (
          index !== -1
        ) {

          delete next[
            `input-${index}`
          ]
        }

        return next
      }
    )
  }

  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validate = () => {

    const validationErrors:
      Record<string, string> =
      {}

    // ----------------------------------------------
    // OPERATION NUMBER
    // ----------------------------------------------

    if (
      !form.operationNumber.trim()
    ) {

      validationErrors.operationNumber =
        'Le numéro de pression est obligatoire.'
    }

    // ----------------------------------------------
    // DATE
    // ----------------------------------------------

    if (
      !form.pressingDate
    ) {

      validationErrors.pressingDate =
        'La date de pression est obligatoire.'
    }

    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    if (
      !form.statusId
    ) {

      validationErrors.statusId =
        'Le statut est obligatoire.'
    }

    // ----------------------------------------------
    // INPUTS
    // ----------------------------------------------

    if (
      form.inputs.length === 0
    ) {

      validationErrors.inputs =
        'Ajoutez au moins une source d’olives.'
    }

    // ----------------------------------------------
    // INPUT VALIDATION
    // ----------------------------------------------

    form.inputs.forEach(
      (input, index) => {

        // --------------------------------------------
        // SOURCE
        // --------------------------------------------

        if (
          input.sourceType ===
          'harvest'
        ) {

          if (
            !input.harvestId
          ) {

            validationErrors[
              `input-${index}`
            ] =
              'Sélectionnez une récolte valide.'
          }

        } else {

          if (
            !input.purchaseItemId
          ) {

            validationErrors[
              `input-${index}`
            ] =
              'Sélectionnez un achat valide.'
          }
        }

        // --------------------------------------------
        // QUANTITY
        // --------------------------------------------

        if (
          !input.quantityKg ||
          Number(
            input.quantityKg
          ) <= 0
        ) {

          validationErrors[
            `quantity-${index}`
          ] =
            'La quantité doit être supérieure à 0.'
        }
      }
    )

    setErrors(
      validationErrors
    )

    return (
      Object.keys(
        validationErrors
      ).length === 0
    )
  }

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit =
    async () => {

      if (
        !validate()
      ) {
        return
      }

      try {

        setSaving(
          true
        )

        const request = {

          operationNumber:
            form.operationNumber,

          pressingDate:
            form.pressingDate,

          statusId:
            form.statusId,

          notes:
            form.notes,

          inputs:
            form.inputs.map(
              (input) => ({

                harvestId:
                  input.sourceType ===
                    'harvest'
                    ? input.harvestId
                    : null,

                purchaseItemId:
                  input.sourceType ===
                    'purchase'
                    ? input.purchaseItemId
                    : null,

                quantityKg:
                  Number(
                    input.quantityKg
                  ),

                notes:
                  input.notes,
              })
            ),
        }

        console.log(
          'Création pression',
          request
        )

        // TODO:
        //
        // await createPressingOperation(
        //   request
        // )

        navigate(
          '/pressingoperations'
        )

      } catch (
      error
      ) {

        console.error(
          error
        )

        setErrors({
          general:
            'Impossible de créer l’opération de pression.',
        })

      } finally {

        setSaving(
          false
        )
      }
    }

  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancel =
    () => {

      if (
        saving
      ) {
        return
      }

      navigate(
        '/pressingoperations'
      )
    }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="feature-page">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div className="page-header">

        <div className="page-header-content">

          <h1 className="page-title">
            Nouvelle opération de pression
          </h1>

          <p className="page-description">
            Créer une nouvelle opération
            de pression et définir les
            olives utilisées.
          </p>

        </div>

      </div>

      {/* ==================================================== */}
      {/* GENERAL INFORMATION */}
      {/* ==================================================== */}

      <div className="filters">

        <div className="filters-header">

          <div>

            <h3>
              Informations générales
            </h3>

            <span>
              Informations relatives
              à l'opération de pression
            </span>

          </div>

        </div>

        <div className="filters-content">

          {/* OPERATION NUMBER */}

          <div className="filter-item">

            <TextInput
              label="N° Pression"
              placeholder="PRESS-2026-001"
              value={
                form.operationNumber
              }
              onChange={(
                event
              ) =>
                updateForm(
                  'operationNumber',
                  event.target.value
                )
              }
            />

            {errors.operationNumber && (
              <span className="field-error">
                {
                  errors.operationNumber
                }
              </span>
            )}

          </div>

          {/* DATE */}

          <div className="filter-item">

            <TextInput
              label="Date de pression"
              type="date"
              value={
                form.pressingDate
              }
              onChange={(
                event
              ) =>
                updateForm(
                  'pressingDate',
                  event.target.value
                )
              }
            />

            {errors.pressingDate && (
              <span className="field-error">
                {
                  errors.pressingDate
                }
              </span>
            )}

          </div>

          {/* STATUS */}

          <div className="filter-item">

            <label>
              Statut
            </label>

            <Select
              options={
                statusOptions
              }

              placeholder={
                constantsLoading
                  ? 'Chargement...'
                  : 'Sélectionnez un statut'
              }

              value={
                form.statusId
              }

              onChange={(
                event
              ) =>
                updateForm(
                  'statusId',
                  Number(
                    event.target.value
                  )
                )
              }
            />

            {errors.statusId && (
              <span className="field-error">
                {
                  errors.statusId
                }
              </span>
            )}

          </div>

          {/* NOTES */}

          <div
            className="filter-item"
            style={{
              gridColumn:
                '1 / -1',
            }}
          >

            <label>
              Notes
            </label>

            <TextEditor
              value={
                form.notes
              }

              placeholder="Notes concernant l'opération..."

              onChange={(
                value
              ) =>
                updateForm(
                  'notes',
                  value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* ==================================================== */}
      {/* OLIVES */}
      {/* ==================================================== */}

      <NewPressingOperationInputsWidget
        inputs={
          form.inputs
        }

        errors={
          errors
        }

        onAdd={
          addInput
        }

        onRemove={
          removeInput
        }

        onUpdate={
          updateInput
        }

        onChangeSource={
          changeInputSource
        }

        onSelectSource={
          handleSelectSource
        }
      />

      {/* ==================================================== */}
      {/* GENERAL ERROR */}
      {/* ==================================================== */}

      {errors.general && (
        <div
          className="field-error"
          style={{
            marginTop:
              '15px',
          }}
        >
          {errors.general}
        </div>
      )}

      {/* ==================================================== */}
      {/* FOOTER */}
      {/* ==================================================== */}

      <div className="filters-footer">

        <Button
          variant="secondary"
          onClick={
            handleCancel
          }
          disabled={
            saving
          }
        >
          Annuler
        </Button>

        <Button
          variant="primary"
          onClick={
            handleSubmit
          }
          disabled={
            saving ||
            constantsLoading
          }
        >
          {saving
            ? 'Création...'
            : 'Créer la pression'}
        </Button>

      </div>

    </div>
  )
}