import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import BlockIcon from '@mui/icons-material/Block'
import Button from '../../../../common/widgets/button/Button'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import TextEditor from '../../../../common/widgets/textEditor/TextEditor'
import { renderStatus } from '../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'
import { ProductionStatus } from '../../domain/entities/ProductionStatus'
import type { PressingOperationDetails } from '../../domain/entities/PressingOperationDetails'
import type { PressingOperationInputDetails } from '../../domain/entities/PressingOperationInputDetails'
import type { SourceOption } from '../widgets/SourceReference'
import type { InputSourceType, PressingOperationInput } from '../widgets/InputTypes'
import NewPressingOperationInputsWidget from '../widgets/NewPressingOperationInputsWidget'
import { usePressingOperationDetailsStore } from '../stores/PressingOperationDetailsStore'
import './PressingOperationDetailsPage.css'
import { getTodayDate, toDateTime } from '../../../shared/utils/DatesUtils'

export default function PressingOperationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { operation: storeOperation, loading, error: storeError, fetchOperation, clear } = usePressingOperationDetailsStore()

  const [operation, setOperation] = useState<PressingOperationDetails | null>(null)
  const [originalOperation, setOriginalOperation] = useState<PressingOperationDetails | null>(null)
  const [saving, setSaving] = useState(false)
  const [starting, setStarting] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [abandoning, setAbandoning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)
  const [newInput, setNewInput] = useState<PressingOperationInput | null>(null)
  const [newInputErrors, setNewInputErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!id) {
      setError('Identifiant de l’opération invalide.')
      return
    }

    const operationId = Number(id)
    if (Number.isNaN(operationId)) {
      setError('Identifiant de l’opération invalide.')
      return
    }

    const loadOperation = async () => {
      try {
        await fetchOperation(operationId)
      } catch (err) {
        console.error('Erreur lors du chargement de l’opération :', err)
        toast.error('Impossible de charger l’opération. Une erreur API est survenue.')
      }
    }

    loadOperation()
    return () => clear()
  }, [id, fetchOperation, clear])

  useEffect(() => {
    if (!storeOperation) return

    const data: PressingOperationDetails = {
      ...storeOperation,
      inputs: storeOperation.inputs.map(input => ({ ...input })),
    }

    setOperation(data)
    setOriginalOperation({ ...data, inputs: data.inputs.map(input => ({ ...input })) })
    setDirty(false)
    setError(null)
  }, [storeOperation])

  useEffect(() => {
    if (storeError) setError(storeError)
  }, [storeError])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const oliveQuantityKg = useMemo(() => {
    if (!operation) return 0
    return operation.inputs.reduce((total, input) => total + Number(input.quantityKg || 0), 0)
  }, [operation])

  const yieldPercentage = useMemo(() => {
    if (!operation || oliveQuantityKg <= 0 || operation.oilQuantityLiters === null || operation.oilQuantityLiters === undefined) return ''
    return ((Number(operation.oilQuantityLiters) / oliveQuantityKg) * 100).toFixed(2)
  }, [operation, oliveQuantityKg])

  const isPlanned = operation?.status === ProductionStatus.Planned
  const isInProgress = operation?.status === ProductionStatus.InProgress
  const isCompleted = operation?.status === ProductionStatus.Completed
  const isAbandoned = operation?.status === ProductionStatus.Cancelled
  const canEditInputs = isPlanned === true
  const canEditOperation = !isCompleted && !isAbandoned
  const canEditOil = isInProgress === true

  const handleBack = useCallback(() => navigate('/production'), [navigate])

  const updateOperation = useCallback(<K extends keyof PressingOperationDetails>(field: K, value: PressingOperationDetails[K]) => {
    setOperation(previous => previous ? { ...previous, [field]: value } : null)
    setDirty(true)
  }, [])

  const updateInputQuantity = useCallback((inputId: number, quantityKg: number) => {
    setOperation(previous => {
      if (!previous) return previous
      return {
        ...previous,
        inputs: previous.inputs.map(input => input.id === inputId ? { ...input, quantityKg } : input),
      }
    })
    setDirty(true)
  }, [])

  const handleOpenAddInput = useCallback(() => {
    const input: PressingOperationInput = {
      id: crypto.randomUUID(),
      sourceType: 'harvest',
      harvestId: null,
      purchaseItemId: null,
      reference: '',
      quantityKg: '',
      notes: '',
    }

    setNewInput(input)
    setNewInputErrors({})
    setShowAddInput(true)
  }, [])

  const handleCancelAddInput = useCallback(() => {
    setShowAddInput(false)
    setNewInput(null)
    setNewInputErrors({})
  }, [])

  const handleUpdateNewInput = useCallback((field: keyof PressingOperationInput, value: string | number | null) => {
    setNewInput(previous => previous ? {
      ...previous,
      [field]: field === 'quantityKg' ? String(value ?? '') : value,
    } : null)

    setNewInputErrors(previous => {
      const next = { ...previous }
      if (field === 'reference') delete next.input
      if (field === 'quantityKg') delete next.quantity
      return next
    })
  }, [])

  const handleChangeNewInputSource = useCallback((sourceType: InputSourceType) => {
    setNewInput(previous => previous ? {
      ...previous,
      sourceType,
      harvestId: null,
      purchaseItemId: null,
      reference: '',
      quantityKg: '',
    } : null)

    setNewInputErrors({})
  }, [])

  const handleSelectNewInputSource = useCallback((source: SourceOption) => {
    setNewInput(previous => {
      if (!previous) return previous

      const quantity = source.quantityKg !== undefined ? String(source.quantityKg) : previous.quantityKg

      if (previous.sourceType === 'harvest') {
        return {
          ...previous,
          harvestId: source.id,
          purchaseItemId: null,
          reference: source.reference,
          quantityKg: quantity,
        }
      }

      return {
        ...previous,
        harvestId: null,
        purchaseItemId: source.id,
        reference: source.reference,
        quantityKg: quantity,
      }
    })

    setNewInputErrors(previous => {
      const next = { ...previous }
      delete next.input
      delete next.quantity
      return next
    })
  }, [])

  const handleConfirmAddInput = useCallback(() => {
    if (!operation || !newInput) return

    const validationErrors: Record<string, string> = {}

    if (newInput.sourceType === 'harvest') {
      if (!newInput.harvestId) validationErrors.input = 'Sélectionnez une récolte valide.'
    } else {
      if (!newInput.purchaseItemId) validationErrors.input = 'Sélectionnez un achat valide.'
    }

    if (!newInput.quantityKg || Number(newInput.quantityKg) <= 0) {
      validationErrors.quantity = 'La quantité doit être supérieure à 0.'
    }

    if (Object.keys(validationErrors).length > 0) {
      setNewInputErrors(validationErrors)
      toast.error('Veuillez corriger les erreurs de la source.')
      return
    }

    const convertedInput: PressingOperationInputDetails = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      sourceType: newInput.sourceType,
      sourceReference: newInput.reference,
      quantityKg: Number(newInput.quantityKg),
      harvestId: newInput.sourceType === 'harvest' ? newInput.harvestId : null,
      purchaseItemId: newInput.sourceType === 'purchase' ? newInput.purchaseItemId : null,
    }

    setOperation(previous => previous ? {
      ...previous,
      inputs: [...previous.inputs, convertedInput],
    } : previous)

    setDirty(true)
    setShowAddInput(false)
    setNewInput(null)
    setNewInputErrors({})
    toast.success('Source ajoutée à l’opération.')
  }, [operation, newInput])

  const handleRemoveInput = useCallback((inputId: number) => {
    setOperation(previous => {
      if (!previous) return previous
      return {
        ...previous,
        inputs: previous.inputs.filter(input => input.id !== inputId),
      }
    })
    setDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!operation) return

    try {
      setSaving(true)

      console.log('SAVE OPERATION', {
        id: operation.id,
        pressingDate: operation.pressingDate,
        startTime: operation.startTime,
        endTime: operation.endTime,
        notes: operation.notes,
        oilQuantityLiters: operation.oilQuantityLiters,
        oliveQuantityKg,
        yieldPercentage,
        inputs: operation.inputs.map(input => ({
          id: input.id,
          harvestId: input.harvestId,
          purchaseItemId: input.purchaseItemId,
          quantityKg: input.quantityKg,
        })),
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      const savedOperation: PressingOperationDetails = {
        ...operation,
        oliveQuantityKg,
        inputs: operation.inputs.map(input => ({ ...input })),
      }

      setOriginalOperation(savedOperation)
      setOperation(savedOperation)
      setDirty(false)
      toast.success('Opération enregistrée avec succès.')
    } catch {
      setError('Impossible d’enregistrer les modifications.')
    } finally {
      setSaving(false)
    }
  }, [operation, oliveQuantityKg, yieldPercentage])

  const handleCancel = useCallback(() => {
    if (!originalOperation) return

    setOperation({
      ...originalOperation,
      inputs: originalOperation.inputs.map(input => ({ ...input })),
    })

    setShowAddInput(false)
    setNewInput(null)
    setNewInputErrors({})
    setDirty(false)
  }, [originalOperation])

  const handleStart = useCallback(async () => {
    if (!operation) return

    try {
      setStarting(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const startDate = operation.startTime ? operation.startTime.slice(0, 10) : getTodayDate()
      const startTime = toDateTime(startDate)

      const updatedOperation = {
        ...operation,
        status: ProductionStatus.InProgress,
        startTime,
      }

      setOperation(updatedOperation)
      setOriginalOperation(updatedOperation)
      setDirty(false)
      toast.success('La pression a été lancée.')
    } catch {
      setError('Impossible de lancer l’opération de pression.')
    } finally {
      setStarting(false)
    }
  }, [operation])

  const handleAbandon = useCallback(async () => {
    if (!operation) return

    const confirmed = window.confirm('Voulez-vous vraiment abandonner cette opération de pression ?')
    if (!confirmed) return

    try {
      setAbandoning(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const abandonedOperation = {
        ...operation,
        status: ProductionStatus.Cancelled,
      }

      setOperation(abandonedOperation)
      setOriginalOperation(abandonedOperation)
      setDirty(false)
      toast.success('La pression a été abandonnée.')
    } catch {
      setError('Impossible d’abandonner l’opération de pression.')
    } finally {
      setAbandoning(false)
    }
  }, [operation])

  const handleFinish = useCallback(async () => {
    if (!operation) return

    try {
      setFinishing(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const endTime = toDateTime(getTodayDate())

      const completedOperation = {
        ...operation,
        status: ProductionStatus.Completed,
        endTime,
      }

      setOperation(completedOperation)
      setOriginalOperation(completedOperation)
      setDirty(false)
      toast.success('La pression a été clôturée.')
    } catch {
      setError('Impossible de clôturer l’opération de pression.')
    } finally {
      setFinishing(false)
    }
  }, [operation])

  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Opération de pression</h1>
            <p className="page-description">Chargement des détails...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !operation) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Opération de pression</h1>
            <p className="page-description">{error ?? 'Opération introuvable.'}</p>
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowBackIcon fontSize="small" /> Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Opération {operation.operationNumber}</h1>
          <p className="page-description">Gestion de l'opération de pression.</p>
        </div>

        <div className="pressing-page-actions">
          <Button variant="secondary" onClick={handleBack} disabled={saving || starting || finishing || abandoning}>
            <ArrowBackIcon fontSize="small" /> Retour
          </Button>

          {isPlanned && (
            <>
              <Button variant="secondary" onClick={handleAbandon} disabled={saving || starting || abandoning}>
                <BlockIcon fontSize="small" /> {abandoning ? 'Abandon...' : 'Abandonner la pression'}
              </Button>

              <Button variant="primary" onClick={handleStart} disabled={saving || starting || abandoning}>
                <PlayArrowIcon fontSize="small" /> {starting ? 'Lancement...' : 'Lancer la pression'}
              </Button>
            </>
          )}

          {isInProgress && (
            <Button variant="primary" onClick={handleFinish} disabled={saving || finishing}>
              <CheckIcon fontSize="small" /> {finishing ? 'Clôture...' : 'Clôturer la pression'}
            </Button>
          )}
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à l'opération de pression</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <label>Date de planification</label>
            <TextInput type="date" value={operation.pressingDate ? operation.pressingDate.slice(0, 10) : ''} disabled={!canEditOperation || saving} onChange={event => updateOperation('pressingDate', toDateTime(event.target.value) as PressingOperationDetails['pressingDate'])} />
          </div>

          <div className="filter-item">
            <label>Statut</label>
            <div>{renderStatus(operation.status, productionStatusConfig)}</div>
          </div>

          <div className="filter-item">
            <label>Quantité d'olives</label>
            <TextInput type="number" value={oliveQuantityKg} disabled onChange={() => undefined} />
          </div>

          <div className="filter-item">
            <label>Huile produite</label>
            <TextInput type="number" value={operation.oilQuantityLiters ?? ''} disabled={!canEditOil || saving} onChange={event => updateOperation('oilQuantityLiters', event.target.value === '' ? null : Number(event.target.value))} />
          </div>

          <div className="filter-item">
            <label>Rendement</label>
            <TextInput type="text" value={yieldPercentage ? `${yieldPercentage} %` : ''} disabled onChange={() => undefined} />
          </div>

          <div className="filter-item">
            <label>Date de lancement</label>
            <TextInput type="date" value={operation.startTime ? operation.startTime.slice(0, 10) : ''} disabled={!isPlanned || saving} onChange={event => updateOperation('startTime', toDateTime(event.target.value))} />
          </div>

          <div className="filter-item">
            <label>Date de fin</label>
            <TextInput type="date" value={operation.endTime ? operation.endTime.slice(0, 10) : ''} disabled onChange={() => undefined} />
          </div>

          <div className="filter-item filter-item-full">
            <label>Notes</label>
            <TextEditor value={operation.notes ?? ''} placeholder="Notes concernant l'opération..." onChange={value => updateOperation('notes', value)} disabled={!canEditOperation || saving} />
          </div>
        </div>
      </div>

      <div className={`filters ${isInProgress ? 'pressing-inputs-disabled' : ''}`}>
        <div className="filters-header">
          <div>
            <h3>Olives utilisées</h3>
            <span>Sources d'olives utilisées pour cette opération de pression</span>
          </div>

          {canEditInputs && !showAddInput && (
            <div className="pressing-add-button">
              <Button variant="secondary" onClick={handleOpenAddInput} disabled={saving}>
                <AddIcon fontSize="small" /> Ajouter
              </Button>
            </div>
          )}
        </div>

        <div className="filters-content">
          {operation.inputs.length === 0 ? (
            <div className="pressing-empty-inputs">Aucune source d'olives.</div>
          ) : (
            <div className="pressing-table-container">
              <table className="pressing-inputs-table">
                <thead>
                  <tr>
                    <th className="pressing-table-cell-left">Type</th>
                    <th className="pressing-table-cell-left">Référence</th>
                    <th className="pressing-table-cell-right">Quantité</th>
                    {canEditInputs && <th className="pressing-table-actions-header" />}
                  </tr>
                </thead>

                <tbody>
                  {operation.inputs.map(input => (
                    <tr key={input.id}>
                      <td className="pressing-table-cell">{input.sourceType === 'harvest' ? 'Récolte' : 'Achat'}</td>
                      <td className="pressing-table-cell">{input.sourceReference}</td>
                      <td className="pressing-table-cell pressing-table-quantity">
                        <div className="pressing-quantity-input">
                          <TextInput type="number" value={input.quantityKg} disabled={!canEditInputs || saving} onChange={event => updateInputQuantity(input.id, Number(event.target.value))} />
                          <span>kg</span>
                        </div>
                      </td>

                      {canEditInputs && (
                        <td className="pressing-table-cell pressing-table-remove">
                          <Button variant="secondary" onClick={() => handleRemoveInput(input.id)} disabled={saving}>
                            Supprimer
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan={2} className="pressing-table-total-label">Total</td>
                    <td className="pressing-table-total-value">{oliveQuantityKg.toLocaleString('fr-FR')} kg</td>
                    {canEditInputs && <td />}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {showAddInput && newInput && canEditInputs && (
          <div className="pressing-new-input">
            <div className="pressing-new-input-header">
              <h3>Nouvelle source</h3>
              <span>Sélectionnez la récolte ou l'achat à utiliser pour cette pression.</span>
            </div>

            <NewPressingOperationInputsWidget
              inputs={[newInput]}
              errors={newInputErrors}
              onAdd={() => undefined}
              onRemove={() => undefined}
              onUpdate={(inputId, field, value) => {
                if (inputId !== newInput.id) return
                handleUpdateNewInput(field, value)
              }}
              onChangeSource={(inputId, sourceType) => {
                if (inputId !== newInput.id) return
                handleChangeNewInputSource(sourceType)
              }}
              onSelectSource={(inputId, source) => {
                if (inputId !== newInput.id) return
                handleSelectNewInputSource(source)
              }}
              showAddButton={false}
            />

            <div className="filters-footer pressing-new-input-footer">
              <Button variant="secondary" onClick={handleCancelAddInput} disabled={saving}>
                Annuler
              </Button>

              <Button variant="primary" onClick={handleConfirmAddInput} disabled={saving || !newInput}>
                <AddIcon fontSize="small" /> Ajouter la source
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="field-error pressing-error">{error}</div>}

      {canEditOperation && (
        <div className="filters-footer">
          <Button variant="secondary" onClick={handleCancel} disabled={!dirty || saving}>
            Annuler
          </Button>

          <Button variant="primary" onClick={handleSave} disabled={!dirty || saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      )}
    </div>
  )
}