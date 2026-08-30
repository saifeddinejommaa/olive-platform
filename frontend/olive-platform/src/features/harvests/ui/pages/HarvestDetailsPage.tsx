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

import type { HarvestStockParams } from '../../domain/params/HarvestStockParams'

type HarvestForm = {
  plotId: number
  varietyId: number
  plannedTrees: number
  harvestDate: string
  notes: string
  quantityKg: number
}

type CompleteHarvestForm = {
  harvestedTrees: number
  quantityKg: number
  completionDate: string
  proceedAnalyse: boolean
  stocks: HarvestStockParams[]
}

const getCurrentDateTimeLocal = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60 * 1000).toISOString().slice(0, 16)
}

const formatKg = (value: number) =>
  `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`

const emptyCompleteForm = (quantityKg = 0, harvestedTrees = 0): CompleteHarvestForm => ({
  harvestedTrees,
  quantityKg,
  completionDate: getCurrentDateTimeLocal(),
  proceedAnalyse: false,
  stocks: [{ quantityKg }],
})

export default function HarvestDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    harvest, loading, saving, error,
    fetchHarvest, update, start, complete, cancel, clear,
  } = useHarvestDetailsStore()

  const { Appconstants, loading: constantsLoading } = useConstantsStore()

  const [form, setForm] = useState<HarvestForm | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [completeDrawerOpen, setCompleteDrawerOpen] = useState(false)
  const [completeForm, setCompleteForm] = useState<CompleteHarvestForm>(emptyCompleteForm())

  useEffect(() => {
    if (!id) return
    fetchHarvest(Number(id))
    return () => clear()
  }, [id, fetchHarvest, clear])

  useEffect(() => {
    if (!harvest) return

    setForm({
      plotId: harvest.plotId,
      varietyId: harvest.variety,
      plannedTrees: harvest.plannedTrees ?? 0,
      harvestDate: harvest.harvestDate ? new Date(harvest.harvestDate).toISOString().split('T')[0] : '',
      notes: harvest.notes ?? '',
      quantityKg: harvest.quantityKg ?? 0,
    })
  }, [harvest])

  const varietyOptions = useMemo(
    () => Appconstants.oliveVarieties.map(variety => ({ value: String(variety.id), label: variety.label })),
    [Appconstants.oliveVarieties],
  )

  const isPlanned = harvest?.status === ProductionStatus.Planned
  const isInProgress = harvest?.status === ProductionStatus.InProgress
  const isCompleted = harvest?.status === ProductionStatus.Completed
  const isCancelled = harvest?.status === ProductionStatus.Cancelled
  const isLocked = isInProgress || isCompleted || isCancelled || saving

  const clearError = (field: string) =>
    setErrors(previous => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })

  const updateForm = useCallback(<K extends keyof HarvestForm>(field: K, value: HarvestForm[K]) => {
    setForm(previous => (previous ? { ...previous, [field]: value } : previous))
    clearError(field)
  }, [])

  const updateCompleteForm = useCallback(<K extends keyof CompleteHarvestForm>(field: K, value: CompleteHarvestForm[K]) => {
    setCompleteForm(previous => ({ ...previous, [field]: value }))
    clearError(field)
  }, [])

  const validateForm = useCallback(() => {
    if (!form) return false

    const validationErrors: Record<string, string> = {}
    if (!form.varietyId) validationErrors.varietyId = 'La variété est obligatoire.'
    if (!form.harvestDate) validationErrors.harvestDate = 'La date de récolte est obligatoire.'
    if (form.plannedTrees < 0) validationErrors.plannedTrees = "Le nombre d'arbres ne peut pas être négatif."
    if (form.quantityKg < 0) validationErrors.quantityKg = "La quantité d'olives ne peut pas être négative."

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [form])

  const handleSave = useCallback(async () => {
    if (!harvest || !form) return
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire.')
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
      toast.error(error ?? 'Impossible de modifier la récolte.')
    }
  }, [harvest, form, validateForm, update, error])

  const handleStart = useCallback(async () => {
    if (!harvest) return
    try {
      await start(harvest.id)
      toast.success('La récolte a été lancée.')
    } catch {
      toast.error(error ?? 'Impossible de lancer la récolte.')
    }
  }, [harvest, start, error])

  const handleOpenCompleteDrawer = useCallback(() => {
    if (!harvest) return
    setCompleteForm(emptyCompleteForm(harvest.quantityKg ?? 0, harvest.harvestedTrees ?? 0))
    setErrors({})
    setCompleteDrawerOpen(true)
  }, [harvest])

  const handleCloseCompleteDrawer = useCallback(() => {
    if (saving) return
    setCompleteDrawerOpen(false)
    setErrors({})
  }, [saving])

  const handleAddStock = useCallback(() => {
    setCompleteForm(previous => ({ ...previous, stocks: [...previous.stocks, { quantityKg: 0 }] }))
  }, [])

  const handleRemoveStock = useCallback((index: number) => {
    setCompleteForm(previous => ({
      ...previous,
      stocks: previous.stocks.filter((_, currentIndex) => currentIndex !== index),
    }))
    clearError(`stock_${index}_quantityKg`)
  }, [])

  const handleStockQuantityChange = useCallback((index: number, quantity: number) => {
    setCompleteForm(previous => ({
      ...previous,
      stocks: previous.stocks.map((stock, currentIndex) =>
        currentIndex === index ? { ...stock, quantityKg: quantity } : stock,
      ),
    }))
    clearError(`stock_${index}_quantityKg`)
    clearError('stocks')
  }, [])

  const totalStocksQuantity = useMemo(
    () => completeForm.stocks.reduce((total, stock) => total + stock.quantityKg, 0),
    [completeForm.stocks],
  )

  const remainingQuantity = completeForm.quantityKg - totalStocksQuantity

  const validateCompleteForm = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {}

    if (completeForm.harvestedTrees < 0) validationErrors.harvestedTrees = "Le nombre d'arbres récoltés ne peut pas être négatif."
    if (completeForm.quantityKg <= 0) validationErrors.quantityKg = "La quantité d'olives doit être supérieure à 0."
    if (!completeForm.completionDate) validationErrors.completionDate = 'La date et l’heure de clôture sont obligatoires.'
    if (completeForm.stocks.length === 0) validationErrors.stocks = 'Au moins un stock doit être renseigné.'

    completeForm.stocks.forEach((stock, index) => {
      if (stock.quantityKg <= 0) validationErrors[`stock_${index}_quantityKg`] = 'La quantité doit être supérieure à 0.'
    })

    // La somme des stocks doit être exactement égale à la quantité récoltée
    if (completeForm.stocks.length > 0 && Math.abs(totalStocksQuantity - completeForm.quantityKg) > 0.001) {
      validationErrors.stocks = `La somme des stocks (${formatKg(totalStocksQuantity)}) doit être égale à la quantité récoltée (${formatKg(completeForm.quantityKg)}).`
    }

    return validationErrors
  }, [completeForm, totalStocksQuantity])

  const handleComplete = useCallback(async () => {
    if (!harvest) return

    const validationErrors = validateCompleteForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await complete(
        harvest.id,
        completeForm.quantityKg,
        completeForm.harvestedTrees,
        completeForm.completionDate,
        completeForm.stocks,
        completeForm.proceedAnalyse,
      )

      setCompleteDrawerOpen(false)
      setErrors({})
      toast.success(
        completeForm.proceedAnalyse
          ? 'La récolte a été clôturée et une analyse a été demandée.'
          : 'La récolte a été clôturée avec succès.',
      )
    } catch {
      toast.error(error ?? 'Impossible de clôturer la récolte.')
    }
  }, [harvest, completeForm, validateCompleteForm, complete, error])

  const handleCancelHarvest = useCallback(async () => {
    if (!harvest) return
    if (!window.confirm('Êtes-vous sûr de vouloir abandonner cette récolte ?')) return

    try {
      await cancel(harvest.id)
      toast.success('La récolte a été abandonnée.')
    } catch {
      toast.error(error ?? "Impossible d'abandonner la récolte.")
    }
  }, [harvest, cancel, error])

  const handleBack = useCallback(() => {
    if (!saving) navigate('/production')
  }, [saving, navigate])

  if (loading) {
    return (
      <div className="feature-page">
        <div className="loading">Chargement de la récolte...</div>
      </div>
    )
  }

  if (!harvest || !form) {
    return (
      <div className="feature-page">
        <div className="error-message">{error ?? 'Récolte introuvable.'}</div>
        <div className="filters-footer">
          <Button variant="secondary" onClick={handleBack}>Retour</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Récolte {harvest.reference}</h1>
          <div>{renderStatus(harvest.status, productionStatusConfig)}</div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isPlanned && (
            <>
              <Button variant="secondary" onClick={handleCancelHarvest} disabled={saving}>
                {saving ? 'Abandon...' : 'Abandonner la récolte'}
              </Button>
              <Button variant="primary" onClick={handleStart} disabled={saving}>
                {saving ? 'Lancement...' : 'Lancer la récolte'}
              </Button>
            </>
          )}
          {isInProgress && (
            <Button variant="primary" onClick={handleOpenCompleteDrawer} disabled={saving}>
              Clôturer la récolte
            </Button>
          )}
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à la récolte</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput label="Référence" value={harvest.reference ?? ''} disabled onChange={() => {}} />
          </div>

          <div className="filter-item">
            <Select
              label="Variété"
              value={String(form.varietyId)}
              onChange={event => updateForm('varietyId', Number(event.target.value))}
              options={[{ value: '0', label: 'Sélectionnez une variété' }, ...varietyOptions]}
              disabled={constantsLoading || isLocked}
            />
            {errors.varietyId && <span className="field-error">{errors.varietyId}</span>}
          </div>

          <div className="filter-item">
            <TextInput
              label="Date de récolte"
              type="date"
              value={form.harvestDate}
              onChange={event => updateForm('harvestDate', event.target.value)}
              disabled={isLocked}
            />
            {errors.harvestDate && <span className="field-error">{errors.harvestDate}</span>}
          </div>

          <div className="filter-item">
            <TextInput
              label="Arbres planifiés"
              type="number"
              min="0"
              value={form.plannedTrees}
              onChange={event => updateForm('plannedTrees', Number(event.target.value))}
              disabled={isLocked}
            />
            {errors.plannedTrees && <span className="field-error">{errors.plannedTrees}</span>}
          </div>

          <div className="filter-item">
            <TextInput label="Arbres récoltés" type="number" value={harvest.harvestedTrees ?? 0} disabled onChange={() => {}} />
          </div>

          <div className="filter-item">
            <TextInput label="Olives récoltées (kg)" type="number" value={harvest.quantityKg ?? 0} disabled onChange={() => {}} />
          </div>

          <div className="filter-item" style={{ gridColumn: '1 / -1' }}>
            <label>Notes</label>
            <TextEditor
              value={form.notes}
              placeholder="Notes concernant la récolte..."
              onChange={value => updateForm('notes', value)}
              disabled={isCompleted || isCancelled || saving}
            />
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Stocks</h3>
              <span>Stocks créés lors de la clôture de la récolte</span>
            </div>
          </div>

          {harvest.stocks && harvest.stocks.length > 0 ? (
            <div className="filters-content">
              {harvest.stocks.map((stock, index) => (
                <div className="filter-item" key={stock.id}>
                  <TextInput label={`Stock ${index + 1}`} type="number" value={stock.quantityKg} disabled onChange={() => {}} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px' }}>Aucun stock associé à cette récolte.</div>
          )}
        </div>
      )}

      <div className="filters-footer">
        <Button variant="secondary" onClick={handleBack} disabled={saving}>Retour</Button>

        {(isPlanned || isInProgress) && (
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        )}

        {(isCompleted || isCancelled) && (
          <span>{isCompleted ? 'Cette récolte est clôturée.' : 'Cette récolte est abandonnée.'}</span>
        )}
      </div>

      <Drawer
        open={completeDrawerOpen}
        title="Clôturer la récolte"
        description="Renseignez les informations finales de la récolte et répartissez la quantité dans les stocks."
        onClose={handleCloseCompleteDrawer}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseCompleteDrawer} disabled={saving}>Annuler</Button>
            <Button variant="primary" onClick={handleComplete} disabled={saving}>
              {saving ? 'Clôture...' : 'Clôturer la récolte'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: '#f8f9fa' }}>
            <strong>Référence de la récolte</strong>
            <div style={{ marginTop: '4px' }}>{harvest.reference ?? '-'}</div>
          </div>

          <div style={{ padding: '16px', borderRadius: '8px', background: '#f8f9fa' }}>
            <strong>Variété</strong>
            <div style={{ marginTop: '4px' }}>{getOliveVarietyLabel(harvest.variety)}</div>
          </div>

          <div className="filter-item">
            <TextInput
              label="Date et heure de clôture"
              type="datetime-local"
              value={completeForm.completionDate}
              onChange={event => updateCompleteForm('completionDate', event.target.value)}
              disabled={saving}
            />
            {errors.completionDate && <span className="field-error">{errors.completionDate}</span>}
          </div>

          <div className="filter-item">
            <TextInput
              label="Arbres récoltés"
              type="number"
              min="0"
              value={completeForm.harvestedTrees}
              onChange={event => updateCompleteForm('harvestedTrees', Number(event.target.value))}
              disabled={saving}
            />
            {errors.harvestedTrees && <span className="field-error">{errors.harvestedTrees}</span>}
            {harvest.plannedTrees != null && (
              <small>{harvest.plannedTrees.toLocaleString('fr-FR')} arbres planifiés</small>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Olives récoltées (kg)"
              type="number"
              min="0"
              step="0.01"
              value={completeForm.quantityKg}
              onChange={event => updateCompleteForm('quantityKg', Number(event.target.value))}
              disabled={saving}
            />
            {errors.quantityKg && <span className="field-error">{errors.quantityKg}</span>}
          </div>

          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: saving ? 'not-allowed' : 'pointer' }}>
              <input
                type="checkbox"
                checked={completeForm.proceedAnalyse}
                onChange={event => updateCompleteForm('proceedAnalyse', event.target.checked)}
                disabled={saving}
                style={{ width: '18px', height: '18px', marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <strong>Procéder à une analyse</strong>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#6b7280' }}>
                  Une analyse des olives sera créée lors de la clôture de la récolte.
                </div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <strong>Répartition des stocks</strong>
                <div style={{ marginTop: '4px' }}>Répartissez la quantité récoltée entre les stocks.</div>
              </div>
              <Button variant="secondary" onClick={handleAddStock} disabled={saving}>+ Ajouter un stock</Button>
            </div>

            {errors.stocks && <span className="field-error">{errors.stocks}</span>}

            {completeForm.stocks.map((stock, index) => (
              <div
                key={index}
                style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              >
                <div className="filter-item">
                  <TextInput
                    label={`Stock ${index + 1} - Quantité (kg)`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={stock.quantityKg}
                    onChange={event => handleStockQuantityChange(index, Number(event.target.value))}
                    disabled={saving}
                  />
                  {errors[`stock_${index}_quantityKg`] && (
                    <span className="field-error">{errors[`stock_${index}_quantityKg`]}</span>
                  )}
                </div>

                <div style={{ paddingTop: '24px' }}>
                  <Button
                    variant="secondary"
                    onClick={() => handleRemoveStock(index)}
                    disabled={saving || completeForm.stocks.length === 1}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', borderRadius: '8px', background: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quantité récoltée</span>
                <strong>{formatKg(completeForm.quantityKg)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quantité dans les stocks</span>
                <strong>{formatKg(totalStocksQuantity)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '4px', borderTop: '1px solid #e5e7eb' }}>
                <span>{remainingQuantity >= 0 ? 'Reste à répartir' : 'Dépassement'}</span>
                <strong>{formatKg(Math.abs(remainingQuantity))}</strong>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
