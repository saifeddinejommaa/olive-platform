import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import TextEditor from '../../../../common/widgets/textEditor/TextEditor'

import { formatDateTime } from '../../../shared/utils/DatesUtils'
import { renderStatus } from '../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'
import { ProductionStatus } from '../../domain/entities/ProductionStatus'

type PressingOperationInputDetails = {
  id: number
  sourceType: 'harvest' | 'purchase'
  reference: string
  quantityKg: number
  harvestId: number | null
  purchaseItemId: number | null
}

type PressingOperationDetails = {
  id: number
  operationNumber: string
  pressingDate: string
  status: ProductionStatus
  oliveQuantityKg: number
  oilQuantityLiters: number | null
  startTime: string | null
  endTime: string | null
  notes: string | null
  inputs: PressingOperationInputDetails[]
}

const mockOperation: PressingOperationDetails = {
  id: 11,
  operationNumber: 'PRESS-2026-0011',
  pressingDate: '2026-08-22T00:00:00',
  status: ProductionStatus.Planned,
  oliveQuantityKg: 18500,
  oilQuantityLiters: 3825,
  startTime: null,
  endTime: null,
  notes:
    'Opération réalisée avec les olives récoltées sur les parcelles Nord et un lot acheté auprès du fournisseur local.',
  inputs: [
    {
      id: 1,
      sourceType: 'harvest',
      reference: 'REC-2026-0042',
      quantityKg: 6500,
      harvestId: 42,
      purchaseItemId: null,
    },
    {
      id: 2,
      sourceType: 'harvest',
      reference: 'REC-2026-0043',
      quantityKg: 5800,
      harvestId: 43,
      purchaseItemId: null,
    },
    {
      id: 3,
      sourceType: 'purchase',
      reference: 'LOT-1231',
      quantityKg: 4200,
      harvestId: null,
      purchaseItemId: 1,
    },
    {
      id: 4,
      sourceType: 'purchase',
      reference: 'LOT-1232',
      quantityKg: 2000,
      harvestId: null,
      purchaseItemId: 2,
    },
  ],
}

export default function PressingOperationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [operation, setOperation] =
    useState<PressingOperationDetails | null>(null)

  const [originalOperation, setOriginalOperation] =
    useState<PressingOperationDetails | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [starting, setStarting] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  /*
   * ------------------------------------------------------------
   * LOAD
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const loadOperation = async () => {
      if (!id) {
        setError('Identifiant de l’opération invalide.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // MOCK TEMPORAIRE
        await new Promise(resolve => setTimeout(resolve, 500))

        const data = {
          ...mockOperation,
          id: Number(id),
          inputs: mockOperation.inputs.map(input => ({
            ...input,
          })),
        }

        setOperation(data)
        setOriginalOperation(data)
        setDirty(false)
      } catch {
        setError(
          'Impossible de récupérer les détails de l’opération.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadOperation()
  }, [id])

  /*
   * ------------------------------------------------------------
   * DERIVED VALUES
   * ------------------------------------------------------------
   */

  const oliveQuantityKg = useMemo(() => {
    if (!operation) return 0

    return operation.inputs.reduce(
      (total, input) => total + Number(input.quantityKg || 0),
      0,
    )
  }, [operation])

  const yieldPercentage = useMemo(() => {
    if (
      !operation ||
      oliveQuantityKg <= 0 ||
      operation.oilQuantityLiters === null
    ) {
      return null
    }

    return (
      (operation.oilQuantityLiters / oliveQuantityKg) *
      100
    ).toFixed(2)
  }, [operation, oliveQuantityKg])

  const canEditInputs =
    operation?.status === ProductionStatus.Planned

  const canEditOperation =
    operation?.status !== ProductionStatus.Completed

  /*
   * ------------------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------------------
   */

  const handleBack = useCallback(() => {
    navigate('/production')
  }, [navigate])

  /*
   * ------------------------------------------------------------
   * UPDATE GENERAL FIELD
   * ------------------------------------------------------------
   */

  const updateOperation = useCallback(
    <K extends keyof PressingOperationDetails>(
      field: K,
      value: PressingOperationDetails[K],
    ) => {
      setOperation(previous =>
        previous
          ? {
              ...previous,
              [field]: value,
            }
          : null,
      )

      setDirty(true)
    },
    [],
  )

  /*
   * ------------------------------------------------------------
   * UPDATE INPUT
   * ------------------------------------------------------------
   */

  const updateInputQuantity = useCallback(
    (inputId: number, quantityKg: number) => {
      setOperation(previous => {
        if (!previous) return previous

        return {
          ...previous,
          inputs: previous.inputs.map(input =>
            input.id === inputId
              ? {
                  ...input,
                  quantityKg,
                }
              : input,
          ),
        }
      })

      setDirty(true)
    },
    [],
  )

  /*
   * ------------------------------------------------------------
   * ADD INPUT
   * ------------------------------------------------------------
   */

  const handleAddInput = useCallback(() => {
    setOperation(previous => {
      if (!previous) return previous

      const newInput: PressingOperationInputDetails = {
        id: Date.now(),
        sourceType: 'harvest',
        reference: 'Nouvelle source',
        quantityKg: 0,
        harvestId: null,
        purchaseItemId: null,
      }

      return {
        ...previous,
        inputs: [...previous.inputs, newInput],
      }
    })

    setDirty(true)
  }, [])

  /*
   * ------------------------------------------------------------
   * REMOVE INPUT
   * ------------------------------------------------------------
   */

  const handleRemoveInput = useCallback((inputId: number) => {
    setOperation(previous => {
      if (!previous) return previous

      return {
        ...previous,
        inputs: previous.inputs.filter(
          input => input.id !== inputId,
        ),
      }
    })

    setDirty(true)
  }, [])

  /*
   * ------------------------------------------------------------
   * SAVE
   * ------------------------------------------------------------
   */

  const handleSave = useCallback(async () => {
    if (!operation) return

    try {
      setSaving(true)

      // TODO API
      console.log('SAVE OPERATION', {
        id: operation.id,
        pressingDate: operation.pressingDate,
        notes: operation.notes,
        oilQuantityLiters: operation.oilQuantityLiters,
        inputs: operation.inputs.map(input => ({
          id: input.id,
          harvestId: input.harvestId,
          purchaseItemId: input.purchaseItemId,
          quantityKg: input.quantityKg,
        })),
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      setOriginalOperation({
        ...operation,
        oliveQuantityKg,
      })

      setDirty(false)
    } catch {
      setError(
        'Impossible d’enregistrer les modifications.',
      )
    } finally {
      setSaving(false)
    }
  }, [operation, oliveQuantityKg])

  /*
   * ------------------------------------------------------------
   * CANCEL CHANGES
   * ------------------------------------------------------------
   */

  const handleCancel = useCallback(() => {
    if (!originalOperation) return

    setOperation({
      ...originalOperation,
      inputs: originalOperation.inputs.map(input => ({
        ...input,
      })),
    })

    setDirty(false)
  }, [originalOperation])

  /*
   * ------------------------------------------------------------
   * START PRESSING
   * ------------------------------------------------------------
   */

  const handleStart = useCallback(async () => {
    if (!operation) return

    try {
      setStarting(true)

      // TODO API
      // await startPressingOperation(operation.id)

      await new Promise(resolve => setTimeout(resolve, 500))

      const startTime = new Date().toISOString()

      setOperation(previous =>
        previous
          ? {
              ...previous,
              status: ProductionStatus.InProgress,
              startTime,
            }
          : null,
      )

      setOriginalOperation(previous =>
        previous
          ? {
              ...previous,
              status: ProductionStatus.InProgress,
              startTime,
            }
          : null,
      )

      setDirty(false)
    } catch {
      setError(
        'Impossible de lancer l’opération de pression.',
      )
    } finally {
      setStarting(false)
    }
  }, [operation])

  /*
   * ------------------------------------------------------------
   * FINISH PRESSING
   * ------------------------------------------------------------
   */

  const handleFinish = useCallback(async () => {
    if (!operation) return

    try {
      setFinishing(true)

      // TODO API
      // await completePressingOperation(operation.id)

      await new Promise(resolve => setTimeout(resolve, 500))

      const endTime = new Date().toISOString()

      setOperation(previous =>
        previous
          ? {
              ...previous,
              status: ProductionStatus.Completed,
              endTime,
            }
          : null,
      )

      setOriginalOperation(previous =>
        previous
          ? {
              ...previous,
              status: ProductionStatus.Completed,
              endTime,
            }
          : null,
      )

      setDirty(false)
    } catch {
      setError(
        'Impossible de terminer l’opération de pression.',
      )
    } finally {
      setFinishing(false)
    }
  }, [operation])

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Opération de pression
            </h1>

            <p className="page-description">
              Chargement des détails...
            </p>
          </div>
        </div>
      </div>
    )
  }

  /*
   * ------------------------------------------------------------
   * ERROR
   * ------------------------------------------------------------
   */

  if (error || !operation) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Opération de pression
            </h1>

            <p className="page-description">
              {error ?? 'Opération introuvable.'}
            </p>
          </div>
        </div>

        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            <ArrowBackIcon fontSize="small" />
            Retour
          </Button>
        </div>
      </div>
    )
  }

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div className="feature-page">
      {/* HEADER */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Opération {operation.operationNumber}
          </h1>

          <p className="page-description">
            Gestion de l'opération de pression.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={saving || starting || finishing}
          >
            <ArrowBackIcon fontSize="small" />
            Retour
          </Button>

          {operation.status === ProductionStatus.Planned && (
            <Button
              variant="primary"
              onClick={handleStart}
              disabled={saving || starting}
            >
              <PlayArrowIcon fontSize="small" />

              {starting
                ? 'Lancement...'
                : 'Lancer la pression'}
            </Button>
          )}

          {operation.status ===
            ProductionStatus.InProgress && (
            <Button
              variant="primary"
              onClick={handleFinish}
              disabled={saving || finishing}
            >
              <CheckIcon fontSize="small" />

              {finishing
                ? 'Finalisation...'
                : 'Terminer la pression'}
            </Button>
          )}
        </div>
      </div>

      {/* GENERAL INFORMATION */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>

            <span>
              Informations relatives à l'opération de
              pression
            </span>
          </div>
        </div>

        <div className="filters-content">
          {/* OPERATION NUMBER */}

          <div className="filter-item">
            <label>N° Pression</label>

            <div>
              {operation.operationNumber}
            </div>
          </div>

          {/* DATE */}

          <div className="filter-item">
            <label>Date de pression</label>

            <TextInput
              type="date"
              value={operation.pressingDate.slice(
                0,
                10,
              )}
              disabled={!canEditOperation || saving}
              onChange={event =>
                updateOperation(
                  'pressingDate',
                  event.target.value,
                )
              }
            />
          </div>

          {/* STATUS */}

          <div className="filter-item">
            <label>Statut</label>

            <div>
              {renderStatus(
                operation.status,
                productionStatusConfig,
              )}
            </div>
          </div>

          {/* OLIVE QUANTITY */}

          <div className="filter-item">
            <label>Quantité d'olives</label>

            <div>
              {oliveQuantityKg.toLocaleString(
                'fr-FR',
              )}{' '}
              kg
            </div>
          </div>

          {/* OIL */}

          <div className="filter-item">
            <label>Huile produite</label>

            <TextInput
              type="number"
              value={
                operation.oilQuantityLiters ?? ''
              }
              disabled={!canEditOperation || saving}
              onChange={event =>
                updateOperation(
                  'oilQuantityLiters',
                  event.target.value === ''
                    ? null
                    : Number(event.target.value),
                )
              }
            />
          </div>

          {/* YIELD */}

          <div className="filter-item">
            <label>Rendement</label>

            <div>
              {yieldPercentage !== null
                ? `${yieldPercentage} %`
                : '—'}
            </div>
          </div>

          {/* START */}

          <div className="filter-item">
            <label>Début</label>

            <div>
              {operation.startTime
                ? formatDateTime(
                    new Date(operation.startTime),
                  )
                : '—'}
            </div>
          </div>

          {/* END */}

          <div className="filter-item">
            <label>Fin</label>

            <div>
              {operation.endTime
                ? formatDateTime(
                    new Date(operation.endTime),
                  )
                : '—'}
            </div>
          </div>

          {/* NOTES */}

          <div
            className="filter-item"
            style={{
              gridColumn: '1 / -1',
            }}
          >
            <label>Notes</label>

            <TextEditor
              value={operation.notes ?? ''}
              placeholder="Notes concernant l'opération..."
              onChange={value =>
                updateOperation('notes', value)
              }
              disabled={!canEditOperation || saving}
            />
          </div>
        </div>
      </div>

      {/* INPUTS */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Olives utilisées</h3>

            <span>
              Sources d'olives utilisées pour cette
              opération de pression
            </span>
          </div>

          {canEditInputs && (
            <Button
              variant="secondary"
              onClick={handleAddInput}
              disabled={saving}
            >
              <AddIcon fontSize="small" />
              Ajouter
            </Button>
          )}
        </div>

        <div className="filters-content">
          {operation.inputs.length === 0 ? (
            <div>
              Aucune source d'olives.
            </div>
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '10px',
                      }}
                    >
                      Type
                    </th>

                    <th
                      style={{
                        textAlign: 'left',
                        padding: '10px',
                      }}
                    >
                      Référence
                    </th>

                    <th
                      style={{
                        textAlign: 'right',
                        padding: '10px',
                      }}
                    >
                      Quantité
                    </th>

                    {canEditInputs && (
                      <th
                        style={{
                          width: '60px',
                        }}
                      />
                    )}
                  </tr>
                </thead>

                <tbody>
                  {operation.inputs.map(input => (
                    <tr key={input.id}>
                      <td
                        style={{
                          padding: '10px',
                        }}
                      >
                        {input.sourceType === 'harvest'
                          ? 'Récolte'
                          : 'Achat'}
                      </td>

                      <td
                        style={{
                          padding: '10px',
                        }}
                      >
                        {input.reference}
                      </td>

                      <td
                        style={{
                          padding: '10px',
                          textAlign: 'right',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent:
                              'flex-end',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <TextInput
                            type="number"
                            value={
                              input.quantityKg
                            }
                            disabled={
                              !canEditInputs ||
                              saving
                            }
                            onChange={event =>
                              updateInputQuantity(
                                input.id,
                                Number(
                                  event.target.value,
                                ),
                              )
                            }
                          />

                          <span>kg</span>
                        </div>
                      </td>

                      {canEditInputs && (
                        <td
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                          }}
                        >
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleRemoveInput(
                                input.id,
                              )
                            }
                            disabled={saving}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td
                      colSpan={
                        canEditInputs ? 2 : 2
                      }
                      style={{
                        padding: '15px 10px',
                        fontWeight: 'bold',
                      }}
                    >
                      Total
                    </td>

                    <td
                      style={{
                        padding: '15px 10px',
                        textAlign: 'right',
                        fontWeight: 'bold',
                      }}
                    >
                      {oliveQuantityKg.toLocaleString(
                        'fr-FR',
                      )}{' '}
                      kg
                    </td>

                    {canEditInputs && (
                      <td />
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="field-error"
          style={{
            marginTop: '15px',
          }}
        >
          {error}
        </div>
      )}

      {/* FOOTER */}

      {canEditOperation && (
        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={!dirty || saving}
          >
            Annuler
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!dirty || saving}
          >
            {saving
              ? 'Enregistrement...'
              : 'Enregistrer'}
          </Button>
        </div>
      )}
    </div>
  )
}