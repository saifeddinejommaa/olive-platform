import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Button from '../../../../common/widgets/button/Button'
import Drawer from '../../../../common/widgets/drawer/Drawer'
import TextInput from '../../../../common/widgets/textInput/TextInput'
import TextEditor from '../../../../common/widgets/textEditor/TextEditor'
import Select from '../../../../common/widgets/select/Select'

import { useConstantsStore } from '../../../appConstants/ConstantsStore'
import { ProductionStatus } from '../../../production/domain/entities/ProductionStatus'
import { useHarvestDetailsStore } from '../stores/HarvestDetailsStore'
import { getOliveVarietyLabel } from '../../../appConstants/helper/AppConstantsHelper'
import { renderStatus } from '../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'

type HarvestForm = {
  plotId: number
  varietyId: number
  plannedTrees: number
  harvestDate: string
  notes: string
  quantityKg: number
}

const getCurrentDateTimeLocal = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, 16)
}

export default function HarvestDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    harvest,
    loading,
    saving,
    error,
    fetchHarvest,
    update,
    start,
    complete,
    cancel,
    clear,
  } = useHarvestDetailsStore()

  const {
    Appconstants,
    loading: constantsLoading,
  } = useConstantsStore()

  const [form, setForm] = useState<HarvestForm | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [completeDrawerOpen, setCompleteDrawerOpen] = useState(false)
  const [harvestedTrees, setHarvestedTrees] = useState(0)
  const [quantityKg, setQuantityKg] = useState(0)
  const [completionDate, setCompletionDate] = useState(
    getCurrentDateTimeLocal(),
  )

  useEffect(() => {
    if (!id) return

    fetchHarvest(Number(id))

    return () => {
      clear()
    }
  }, [id, fetchHarvest, clear])

  useEffect(() => {
    if (!harvest) return

    setForm({
      plotId: harvest.plotId,
      varietyId: harvest.variety,
      plannedTrees: harvest.plannedTrees ?? 0,
      harvestDate: harvest.harvestDate
        ? new Date(harvest.harvestDate)
          .toISOString()
          .split('T')[0]
        : '',
      notes: harvest.notes ?? '',
      quantityKg: harvest.quantityKg ?? 0,
    })
  }, [harvest])

  const varietyOptions = useMemo(
    () =>
      Appconstants.oliveVarieties.map(variety => ({
        value: String(variety.id),
        label: variety.label,
      })),
    [Appconstants.oliveVarieties],
  )

  const isPlanned =
    harvest?.status === ProductionStatus.Planned

  const isInProgress =
    harvest?.status === ProductionStatus.InProgress

  const isCompleted =
    harvest?.status === ProductionStatus.Completed

  const isCancelled =
    harvest?.status === ProductionStatus.Cancelled

  const updateForm = useCallback(
    <K extends keyof HarvestForm>(
      field: K,
      value: HarvestForm[K],
    ) => {
      setForm(previous =>
        previous
          ? {
            ...previous,
            [field]: value,
          }
          : previous,
      )

      setErrors(previous => {
        if (!previous[field]) return previous

        const next = { ...previous }
        delete next[field]

        return next
      })
    },
    [],
  )

  const validateForm = useCallback(() => {
    if (!form) return false

    const validationErrors: Record<string, string> = {}

    if (!form.varietyId) {
      validationErrors.varietyId =
        'La variété est obligatoire.'
    }

    if (!form.harvestDate) {
      validationErrors.harvestDate =
        'La date de récolte est obligatoire.'
    }

    if (form.plannedTrees < 0) {
      validationErrors.plannedTrees =
        "Le nombre d'arbres ne peut pas être négatif."
    }

    if (form.quantityKg < 0) {
      validationErrors.quantityKg =
        "La quantité d'olives ne peut pas être négative."
    }

    setErrors(validationErrors)

    return Object.keys(validationErrors).length === 0
  }, [form])

  const handleSave = useCallback(async () => {
    if (!harvest || !form) return

    if (!validateForm()) {
      toast.error(
        'Veuillez corriger les erreurs du formulaire.',
      )
      return
    }

    try {
      await update(harvest.id, {
        plotId: form.plotId,
        varietyId: form.varietyId,
        plannedTrees: form.plannedTrees,
        harvestDate: form.harvestDate,
        notes: form.notes,
      })

      toast.success('Récolte modifiée avec succès.')
    } catch {
      toast.error(
        error ?? 'Impossible de modifier la récolte.',
      )
    }
  }, [
    harvest,
    form,
    validateForm,
    update,
    error,
  ])

  const handleStart = useCallback(async () => {
    if (!harvest) return

    try {
      await start(harvest.id)

      toast.success('La récolte a été lancée.')
    } catch {
      toast.error(
        error ?? 'Impossible de lancer la récolte.',
      )
    }
  }, [harvest, start, error])

  const handleOpenCompleteDrawer = useCallback(() => {
    if (!harvest) return

    setHarvestedTrees(harvest.harvestedTrees ?? 0)
    setQuantityKg(harvest.quantityKg ?? 0)
    setCompletionDate(getCurrentDateTimeLocal())
    setErrors({})
    setCompleteDrawerOpen(true)
  }, [harvest])

  const handleCloseCompleteDrawer = useCallback(() => {
    if (saving) return

    setCompleteDrawerOpen(false)
    setErrors({})
  }, [saving])

  const handleComplete = useCallback(async () => {
    if (!harvest) return

    const validationErrors: Record<string, string> = {}

    if (harvestedTrees < 0) {
      validationErrors.harvestedTrees =
        "Le nombre d'arbres récoltés ne peut pas être négatif."
    }

    if (quantityKg < 0) {
      validationErrors.quantityKg =
        "La quantité d'olives ne peut pas être négative."
    }

    if (!completionDate) {
      validationErrors.completionDate =
        'La date et l’heure de clôture sont obligatoires.'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await complete(
        harvest.id,
        quantityKg,
        harvestedTrees,
        completionDate,
      )

      setCompleteDrawerOpen(false)
      setErrors({})

      toast.success(
        'La récolte a été clôturée avec succès.',
      )
    } catch {
      toast.error(
        error ?? 'Impossible de clôturer la récolte.',
      )
    }
  }, [
    harvest,
    harvestedTrees,
    quantityKg,
    completionDate,
    complete,
    error,
  ])

  const handleCancelHarvest = useCallback(async () => {
    if (!harvest) return

    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir abandonner cette récolte ?',
    )

    if (!confirmed) return

    try {
      await cancel(harvest.id)

      toast.success('La récolte a été abandonnée.')
    } catch {
      toast.error(
        error ?? "Impossible d'abandonner la récolte.",
      )
    }
  }, [harvest, cancel, error])

  const handleBack = useCallback(() => {
    if (!saving) {
      navigate('/production')
    }
  }, [saving, navigate])

  if (loading) {
    return (
      <div className="feature-page">
        <div className="loading">
          Chargement de la récolte...
        </div>
      </div>
    )
  }

  if (!harvest || !form) {
    return (
      <div className="feature-page">
        <div className="error-message">
          {error ?? 'Récolte introuvable.'}
        </div>

        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Récolte {harvest.reference}
          </h1>
          <div>
            {renderStatus(
              harvest.status,
              productionStatusConfig,
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {isPlanned && (
            <>
              <Button
                variant="secondary"
                onClick={handleCancelHarvest}
                disabled={saving}
              >
                {saving
                  ? 'Abandon...'
                  : 'Abandonner la récolte'}
              </Button>

              <Button
                variant="primary"
                onClick={handleStart}
                disabled={saving}
              >
                {saving
                  ? 'Lancement...'
                  : 'Lancer la récolte'}
              </Button>
            </>
          )}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleOpenCompleteDrawer}
              disabled={saving}
            >
              Clôturer la récolte
            </Button>
          )}
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>

            <span>
              Informations relatives à la récolte
            </span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput
              label="Référence"
              value={harvest.reference ?? ''}
              disabled
              onChange={() => { }}
            />
          </div>

          <div className="filter-item">
            <Select
              label="Variété"
              value={String(form.varietyId)}
              onChange={event =>
                updateForm(
                  'varietyId',
                  Number(event.target.value),
                )
              }
              options={[
                {
                  value: '0',
                  label: 'Sélectionnez une variété',
                },
                ...varietyOptions,
              ]}
              disabled={
                constantsLoading ||
                isInProgress ||
                isCompleted ||
                isCancelled ||
                saving
              }
            />

            {errors.varietyId && (
              <span className="field-error">
                {errors.varietyId}
              </span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Date de récolte"
              type="date"
              value={form.harvestDate}
              onChange={event =>
                updateForm(
                  'harvestDate',
                  event.target.value,
                )
              }
              disabled={
                isInProgress ||
                isCompleted ||
                isCancelled ||
                saving
              }
            />

            {errors.harvestDate && (
              <span className="field-error">
                {errors.harvestDate}
              </span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Arbres planifiés"
              type="number"
              min="0"
              value={form.plannedTrees}
              onChange={event =>
                updateForm(
                  'plannedTrees',
                  Number(event.target.value),
                )
              }
              disabled={
                isInProgress ||
                isCompleted ||
                isCancelled ||
                saving
              }
            />

            {errors.plannedTrees && (
              <span className="field-error">
                {errors.plannedTrees}
              </span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Arbres récoltés"
              type="number"
              value={harvest.harvestedTrees ?? 0}
              disabled
              onChange={() => { }}
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Olives récoltées (kg)"
              type="number"
              value={harvest.quantityKg ?? 0}
              disabled
              onChange={() => { }}
            />
          </div>

          <div
            className="filter-item"
            style={{ gridColumn: '1 / -1' }}
          >
            <label>Notes</label>

            <TextEditor
              value={form.notes}
              placeholder="Notes concernant la récolte..."
              onChange={value =>
                updateForm('notes', value)
              }
              disabled={
                isCompleted ||
                isCancelled ||
                saving
              }
            />
          </div>
        </div>
      </div>

      <div className="filters-footer">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={saving}
        >
          Retour
        </Button>

        {(isPlanned || isInProgress) && (
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? 'Enregistrement...'
              : 'Enregistrer les modifications'}
          </Button>
        )}

        {(isCompleted || isCancelled) && (
          <span>
            {isCompleted
              ? 'Cette récolte est clôturée.'
              : 'Cette récolte est abandonnée.'}
          </span>
        )}
      </div>

      <Drawer
        open={completeDrawerOpen}
        title="Clôturer la récolte"
        description="Renseignez les informations finales de la récolte."
        onClose={handleCloseCompleteDrawer}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCloseCompleteDrawer}
              disabled={saving}
            >
              Annuler
            </Button>

            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={saving}
            >
              {saving
                ? 'Clôture...'
                : 'Clôturer la récolte'}
            </Button>
          </>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>Référence du lot</strong>

            <div style={{ marginTop: '4px' }}>
              {harvest.reference ?? '-'}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>Variété</strong>

            <div style={{ marginTop: '4px' }}>
              {getOliveVarietyLabel(harvest.variety)}
            </div>
          </div>

          <div className="filter-item">
            <TextInput
              label="Date et heure de clôture"
              type="datetime-local"
              value={completionDate}
              onChange={event =>
                setCompletionDate(event.target.value)
              }
              disabled={saving}
            />

            {errors.completionDate && (
              <span className="field-error">
                {errors.completionDate}
              </span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Arbres récoltés"
              type="number"
              min="0"
              value={harvestedTrees}
              onChange={event =>
                setHarvestedTrees(
                  Number(event.target.value),
                )
              }
              disabled={saving}
            />

            {errors.harvestedTrees && (
              <span className="field-error">
                {errors.harvestedTrees}
              </span>
            )}

            {harvest.plannedTrees !== null &&
              harvest.plannedTrees !== undefined && (
                <small>
                  {harvest.plannedTrees.toLocaleString(
                    'fr-FR',
                  )}{' '}
                  arbres planifiés
                </small>
              )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Olives récoltées (kg)"
              type="number"
              min="0"
              step="0.01"
              value={quantityKg}
              onChange={event =>
                setQuantityKg(
                  Number(event.target.value),
                )
              }
              disabled={saving}
            />

            {errors.quantityKg && (
              <span className="field-error">
                {errors.quantityKg}
              </span>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  )
}