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

import { formatDateTime } from '../../../shared/utils/DatesUtils'
import { renderStatus } from '../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../shared/status/ProductionStatusConfig'
import { ProductionStatus } from '../../domain/entities/ProductionStatus'

import type { PressingOperationDetails } from '../../domain/entities/PressingOperationDetails'
import type { PressingOperationInputDetails } from '../../domain/entities/PressingOperationInputDetails'

import type { SourceOption } from '../widgets/SourceReference'

import type {
  InputSourceType,
  PressingOperationInput,
} from '../widgets/InputTypes'

import NewPressingOperationInputsWidget from '../widgets/NewPressingOperationInputsWidget'

/*
 * ============================================================
 * MOCK
 * ============================================================
 */

const mockOperation: PressingOperationDetails = {
  id: 11,
  operationNumber: 'PRESS-2026-0011',

  /*
   * Cette date représente maintenant la date de planification.
   */
  pressingDate: '2026-08-22T00:00:00',

  status: ProductionStatus.Planned,

  /*
   * Cette valeur est recalculée depuis inputs.
   * Elle est conservée ici uniquement parce qu'elle existe
   * dans l'entité actuelle.
   */
  oliveQuantityKg: 18500,

  oilQuantityLiters: 3825,

  /*
   * Date de lancement.
   */
  startTime: null,

  /*
   * Date de fin.
   */
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

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

/*
 * Date du jour au format YYYY-MM-DD.
 */
const getTodayDate = () => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(
    today.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    today.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/*
 * Transforme YYYY-MM-DD en ISO datetime.
 */
const toDateTime = (date: string) => {
  if (!date) {
    return null
  }

  return `${date}T00:00:00`
}

/*
 * ============================================================
 * PAGE
 * ============================================================
 */

export default function PressingOperationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [operation, setOperation] =
    useState<PressingOperationDetails | null>(null)

  const [originalOperation, setOriginalOperation] =
    useState<PressingOperationDetails | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [starting, setStarting] =
    useState(false)

  const [finishing, setFinishing] =
    useState(false)

  const [abandoning, setAbandoning] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [dirty, setDirty] =
    useState(false)

  /*
   * ============================================================
   * NOUVELLE SOURCE
   * ============================================================
   */

  const [showAddInput, setShowAddInput] =
    useState(false)

  const [newInput, setNewInput] =
    useState<PressingOperationInput | null>(
      null,
    )

  const [newInputErrors, setNewInputErrors] =
    useState<Record<string, string>>({})

  /*
   * ============================================================
   * CHARGEMENT
   * ============================================================
   */

  useEffect(() => {
    const loadOperation = async () => {
      if (!id) {
        setError(
          'Identifiant de l’opération invalide.',
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        await new Promise(resolve =>
          setTimeout(resolve, 500),
        )

        const data: PressingOperationDetails = {
          ...mockOperation,
          id: Number(id),
          inputs:
            mockOperation.inputs.map(
              input => ({
                ...input,
              }),
            ),
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
   * ============================================================
   * CALCUL QUANTITE OLIVES
   * ============================================================
   */

  const oliveQuantityKg = useMemo(() => {
    if (!operation) {
      return 0
    }

    return operation.inputs.reduce(
      (total, input) =>
        total +
        Number(input.quantityKg || 0),
      0,
    )
  }, [operation])

  /*
   * ============================================================
   * CALCUL RENDEMENT
   *
   * Toujours calculé automatiquement.
   * Toujours affiché comme champ grisé.
   * ============================================================
   */

  const yieldPercentage = useMemo(() => {
    if (
      !operation ||
      oliveQuantityKg <= 0 ||
      operation.oilQuantityLiters === null ||
      operation.oilQuantityLiters === undefined
    ) {
      return ''
    }

    return (
      (
        (Number(
          operation.oilQuantityLiters,
        ) /
          oliveQuantityKg) *
        100
      ).toFixed(2)
    )
  }, [
    operation,
    oliveQuantityKg,
  ])

  /*
   * ============================================================
   * ETATS
   * ============================================================
   */

  const isPlanned =
    operation?.status ===
    ProductionStatus.Planned

  const isInProgress =
    operation?.status ===
    ProductionStatus.InProgress

  const isCompleted =
    operation?.status ===
    ProductionStatus.Completed

  /*
   * L'état "Abandoned" n'est volontairement pas directement
   * référencé dans ProductionStatus afin de ne pas casser
   * la compilation si ton enum actuel ne possède pas encore
   * cette valeur.
   */
  const isAbandoned =
    operation?.status ===
    ProductionStatus.Cancelled

  /*
   * Les sources sont uniquement modifiables quand
   * l'opération est planifiée.
   */
  const canEditInputs =
    isPlanned === true

  /*
   * Les informations générales restent modifiables
   * tant que l'opération n'est pas terminée/abandonnée.
   */
  const canEditOperation =
    !isCompleted &&
    !isAbandoned

  /*
   * L'huile est modifiable uniquement lorsque
   * la pression est en cours.
   */
  const canEditOil =
    isInProgress === true

  /*
   * ============================================================
   * NAVIGATION
   * ============================================================
   */

  const handleBack = useCallback(() => {
    navigate('/production')
  }, [navigate])

  /*
   * ============================================================
   * UPDATE OPERATION
   * ============================================================
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
   * ============================================================
   * UPDATE QUANTITE SOURCE
   * ============================================================
   */

  const updateInputQuantity = useCallback(
    (
      inputId: number,
      quantityKg: number,
    ) => {
      setOperation(previous => {
        if (!previous) {
          return previous
        }

        return {
          ...previous,

          inputs:
            previous.inputs.map(
              input =>
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
   * ============================================================
   * OUVRIR AJOUT SOURCE
   * ============================================================
   */

  const handleOpenAddInput =
    useCallback(() => {
      const input: PressingOperationInput =
        {
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

  /*
   * ============================================================
   * ANNULER AJOUT SOURCE
   * ============================================================
   */

  const handleCancelAddInput =
    useCallback(() => {
      setShowAddInput(false)
      setNewInput(null)
      setNewInputErrors({})
    }, [])

  /*
   * ============================================================
   * UPDATE NOUVELLE SOURCE
   * ============================================================
   */

  const handleUpdateNewInput =
    useCallback(
      (
        field: keyof PressingOperationInput,
        value:
          | string
          | number
          | null,
      ) => {
        setNewInput(previous =>
          previous
            ? {
                ...previous,
                [field]:
                  field === 'quantityKg'
                    ? String(value ?? '')
                    : value,
              }
            : null,
        )

        setNewInputErrors(previous => {
          const next = {
            ...previous,
          }

          if (field === 'reference') {
            delete next.input
          }

          if (field === 'quantityKg') {
            delete next.quantity
          }

          return next
        })
      },
      [],
    )

  /*
   * ============================================================
   * CHANGEMENT TYPE SOURCE
   * ============================================================
   */

  const handleChangeNewInputSource =
    useCallback(
      (
        sourceType: InputSourceType,
      ) => {
        setNewInput(previous =>
          previous
            ? {
                ...previous,
                sourceType,
                harvestId: null,
                purchaseItemId: null,
                reference: '',
                quantityKg: '',
              }
            : null,
        )

        setNewInputErrors({})
      },
      [],
    )

  /*
   * ============================================================
   * SELECTION SOURCE
   * ============================================================
   */

  const handleSelectNewInputSource =
    useCallback(
      (source: SourceOption) => {
        setNewInput(previous => {
          if (!previous) {
            return previous
          }

          /*
           * IMPORTANT :
           * quantityKg reste une string dans
           * PressingOperationInput.
           *
           * On convertit donc automatiquement
           * la quantité reçue en string.
           */
          const quantity =
            source.quantityKg !==
            undefined
              ? String(
                  source.quantityKg,
                )
              : previous.quantityKg

          if (
            previous.sourceType ===
            'harvest'
          ) {
            return {
              ...previous,
              harvestId: source.id,
              purchaseItemId: null,
              reference:
                source.reference,
              quantityKg: quantity,
            }
          }

          return {
            ...previous,
            harvestId: null,
            purchaseItemId:
              source.id,
            reference:
              source.reference,
            quantityKg: quantity,
          }
        })

        setNewInputErrors(
          previous => {
            const next = {
              ...previous,
            }

            delete next.input
            delete next.quantity

            return next
          },
        )
      },
      [],
    )

  /*
   * ============================================================
   * CONFIRMER NOUVELLE SOURCE
   * ============================================================
   */

  const handleConfirmAddInput =
    useCallback(() => {
      if (!operation || !newInput) {
        return
      }

      const validationErrors: Record<
        string,
        string
      > = {}

      /*
       * Validation source.
       */
      if (
        newInput.sourceType ===
        'harvest'
      ) {
        if (!newInput.harvestId) {
          validationErrors.input =
            'Sélectionnez une récolte valide.'
        }
      } else {
        if (!newInput.purchaseItemId) {
          validationErrors.input =
            'Sélectionnez un achat valide.'
        }
      }

      /*
       * Validation quantité.
       */
      if (
        !newInput.quantityKg ||
        Number(
          newInput.quantityKg,
        ) <= 0
      ) {
        validationErrors.quantity =
          'La quantité doit être supérieure à 0.'
      }

      if (
        Object.keys(
          validationErrors,
        ).length > 0
      ) {
        setNewInputErrors(
          validationErrors,
        )

        toast.error(
          'Veuillez corriger les erreurs de la source.',
        )

        return
      }

      const convertedInput: PressingOperationInputDetails =
        {
          id:
            Date.now() +
            Math.floor(
              Math.random() * 10000,
            ),

          sourceType:
            newInput.sourceType,

          reference:
            newInput.reference,

          quantityKg: Number(
            newInput.quantityKg,
          ),

          harvestId:
            newInput.sourceType ===
            'harvest'
              ? newInput.harvestId
              : null,

          purchaseItemId:
            newInput.sourceType ===
            'purchase'
              ? newInput.purchaseItemId
              : null,
        }

      setOperation(previous =>
        previous
          ? {
              ...previous,
              inputs: [
                ...previous.inputs,
                convertedInput,
              ],
            }
          : previous,
      )

      setDirty(true)

      setShowAddInput(false)
      setNewInput(null)
      setNewInputErrors({})

      toast.success(
        'Source ajoutée à l’opération.',
      )
    }, [
      operation,
      newInput,
    ])

  /*
   * ============================================================
   * SUPPRIMER SOURCE
   * ============================================================
   */

  const handleRemoveInput =
    useCallback(
      (inputId: number) => {
        setOperation(previous => {
          if (!previous) {
            return previous
          }

          return {
            ...previous,

            inputs:
              previous.inputs.filter(
                input =>
                  input.id !==
                  inputId,
              ),
          }
        })

        setDirty(true)
      },
      [],
    )

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  const handleSave =
    useCallback(async () => {
      if (!operation) {
        return
      }

      try {
        setSaving(true)

        console.log(
          'SAVE OPERATION',
          {
            id: operation.id,

            pressingDate:
              operation.pressingDate,

            startTime:
              operation.startTime,

            endTime:
              operation.endTime,

            notes:
              operation.notes,

            oilQuantityLiters:
              operation.oilQuantityLiters,

            oliveQuantityKg,

            yieldPercentage,

            inputs:
              operation.inputs.map(
                input => ({
                  id: input.id,
                  harvestId:
                    input.harvestId,
                  purchaseItemId:
                    input.purchaseItemId,
                  quantityKg:
                    input.quantityKg,
                }),
              ),
          },
        )

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              500,
            ),
        )

        setOriginalOperation({
          ...operation,
          oliveQuantityKg,
        })

        setDirty(false)

        toast.success(
          'Opération enregistrée avec succès.',
        )
      } catch {
        setError(
          'Impossible d’enregistrer les modifications.',
        )
      } finally {
        setSaving(false)
      }
    }, [
      operation,
      oliveQuantityKg,
      yieldPercentage,
    ])

  /*
   * ============================================================
   * CANCEL
   * ============================================================
   */

  const handleCancel =
    useCallback(() => {
      if (!originalOperation) {
        return
      }

      setOperation({
        ...originalOperation,

        inputs:
          originalOperation.inputs.map(
            input => ({
              ...input,
            }),
          ),
      })

      setShowAddInput(false)
      setNewInput(null)
      setNewInputErrors({})

      setDirty(false)
    }, [
      originalOperation,
    ])

  /*
   * ============================================================
   * LANCER LA PRESSION
   *
   * startTime = date du jour par défaut.
   * ============================================================
   */

  const handleStart =
    useCallback(async () => {
      if (!operation) {
        return
      }

      try {
        setStarting(true)

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              500,
            ),
        )

        const startDate =
          getTodayDate()

        const startTime =
          toDateTime(startDate)

        setOperation(previous =>
          previous
            ? {
                ...previous,

                status:
                  ProductionStatus.InProgress,

                startTime,
              }
            : null,
        )

        setOriginalOperation(
          previous =>
            previous
              ? {
                  ...previous,

                  status:
                    ProductionStatus.InProgress,

                  startTime,
                }
              : null,
        )

        setDirty(false)

        toast.success(
          'La pression a été lancée.',
        )
      } catch {
        setError(
          'Impossible de lancer l’opération de pression.',
        )
      } finally {
        setStarting(false)
      }
    }, [operation])

  /*
   * ============================================================
   * ABANDONNER LA PRESSION
   * ============================================================
   */

  const handleAbandon =
    useCallback(async () => {
      if (!operation) {
        return
      }

      const confirmed =
        window.confirm(
          'Voulez-vous vraiment abandonner cette opération de pression ?',
        )

      if (!confirmed) {
        return
      }

      try {
        setAbandoning(true)

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              500,
            ),
        )

        /*
         * Si ton enum possède une valeur Abandoned,
         * remplace simplement cette valeur par :
         *
         * ProductionStatus.Abandoned
         */
        const abandonedStatus =
          ProductionStatus.Cancelled

        setOperation(previous =>
          previous
            ? {
                ...previous,
                status:
                  abandonedStatus,
              }
            : null,
        )

        setOriginalOperation(
          previous =>
            previous
              ? {
                  ...previous,
                  status:
                    abandonedStatus,
                }
              : null,
        )

        setDirty(false)

        toast.success(
          'La pression a été abandonnée.',
        )
      } catch {
        setError(
          'Impossible d’abandonner l’opération de pression.',
        )
      } finally {
        setAbandoning(false)
      }
    }, [operation])

  /*
   * ============================================================
   * CLOTURER LA PRESSION
   * ============================================================
   */

  const handleFinish =
    useCallback(async () => {
      if (!operation) {
        return
      }

      try {
        setFinishing(true)

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              500,
            ),
        )

        const endDate =
          getTodayDate()

        const endTime =
          toDateTime(endDate)

        setOperation(previous =>
          previous
            ? {
                ...previous,

                status:
                  ProductionStatus.Completed,

                endTime,
              }
            : null,
        )

        setOriginalOperation(
          previous =>
            previous
              ? {
                  ...previous,

                  status:
                    ProductionStatus.Completed,

                  endTime,
                }
              : null,
        )

        setDirty(false)

        toast.success(
          'La pression a été clôturée.',
        )
      } catch {
        setError(
          'Impossible de clôturer l’opération de pression.',
        )
      } finally {
        setFinishing(false)
      }
    }, [operation])

  /*
   * ============================================================
   * LOADING
   * ============================================================
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
   * ============================================================
   * ERROR
   * ============================================================
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
              {error ??
                'Opération introuvable.'}
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
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="feature-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Opération{' '}
            {operation.operationNumber}
          </h1>

          <p className="page-description">
            Gestion de l'opération de
            pression.
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
            disabled={
              saving ||
              starting ||
              finishing ||
              abandoning
            }
          >
            <ArrowBackIcon fontSize="small" />
            Retour
          </Button>

          {/* ================================================
              PLANIFIEE
          ================================================= */}

          {isPlanned && (
            <>
              <Button
                variant="secondary"
                onClick={
                  handleAbandon
                }
                disabled={
                  saving ||
                  starting ||
                  abandoning
                }
              >
                <BlockIcon fontSize="small" />

                {abandoning
                  ? 'Abandon...'
                  : 'Abandonner la pression'}
              </Button>

              <Button
                variant="primary"
                onClick={handleStart}
                disabled={
                  saving ||
                  starting ||
                  abandoning
                }
              >
                <PlayArrowIcon fontSize="small" />

                {starting
                  ? 'Lancement...'
                  : 'Lancer la pression'}
              </Button>
            </>
          )}

          {/* ================================================
              EN COURS
          ================================================= */}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={
                handleFinish
              }
              disabled={
                saving ||
                finishing
              }
            >
              <CheckIcon fontSize="small" />

              {finishing
                ? 'Clôture...'
                : 'Clôturer la pression'}
            </Button>
          )}
        </div>
      </div>

      {/* ======================================================
          INFORMATIONS GENERALES
      ====================================================== */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>
              Informations générales
            </h3>

            <span>
              Informations relatives à
              l'opération de pression
            </span>
          </div>
        </div>

        <div className="filters-content">

          {/* ==================================================
              DATE PLANIFICATION
          ================================================== */}

          <div className="filter-item">
            <label>
              Date de planification
            </label>

            <TextInput
              type="date"
              value={operation.pressingDate
                ? operation.pressingDate.slice(
                    0,
                    10,
                  )
                : ''}
              disabled={
                !canEditOperation ||
                saving
              }
              onChange={event =>
                updateOperation(
                  'pressingDate',
                  `${event.target.value}T00:00:00`,
                )
              }
            />
          </div>

          {/* ==================================================
              STATUT
          ================================================== */}

          <div className="filter-item">
            <label>Statut</label>

            <div>
              {renderStatus(
                operation.status,
                productionStatusConfig,
              )}
            </div>
          </div>

          {/* ==================================================
              QUANTITE OLIVES
              TOUJOURS GRISÉE
          ================================================== */}

          <div className="filter-item">
            <label>
              Quantité d'olives
            </label>

            <TextInput
              type="number"
              value={oliveQuantityKg}
              disabled
              onChange={() => undefined}
            />
          </div>

          {/* ==================================================
              HUILE PRODUITE
          ================================================== */}

          <div className="filter-item">
            <label>
              Huile produite
            </label>

            <TextInput
              type="number"
              value={
                operation.oilQuantityLiters ??
                ''
              }
              disabled={
                !canEditOil ||
                saving
              }
              onChange={event =>
                updateOperation(
                  'oilQuantityLiters',
                  event.target.value ===
                    ''
                    ? null
                    : Number(
                        event.target
                          .value,
                      ),
                )
              }
            />
          </div>

          {/* ==================================================
              RENDEMENT
              TOUJOURS GRISÉ
          ================================================== */}

          <div className="filter-item">
            <label>
              Rendement
            </label>

            <TextInput
              type="text"
              value={
                yieldPercentage
                  ? `${yieldPercentage} %`
                  : ''
              }
              disabled
              onChange={() =>
                undefined
              }
            />
          </div>

          {/* ==================================================
              DATE DE LANCEMENT
          ================================================== */}

          <div className="filter-item">
            <label>
              Date de lancement
            </label>

            <TextInput
              type="date"
              value={
                operation.startTime
                  ? operation.startTime.slice(
                      0,
                      10,
                    )
                  : ''
              }
              disabled={
                /*
                 * En planifié :
                 * la date peut être renseignée/modifiée.
                 *
                 * En cours :
                 * elle est grisée.
                 *
                 * Une fois terminé :
                 * elle est évidemment grisée.
                 */
                !isPlanned ||
                saving
              }
              onChange={event =>
                updateOperation(
                  'startTime',
                  toDateTime(
                    event.target.value,
                  ),
                )
              }
            />
          </div>

          {/* ==================================================
              DATE DE FIN
              TOUJOURS UN CHAMP
          ================================================== */}

          <div className="filter-item">
            <label>
              Date de fin
            </label>

            <TextInput
              type="date"
              value={
                operation.endTime
                  ? operation.endTime.slice(
                      0,
                      10,
                    )
                  : ''
              }
              disabled
              onChange={() =>
                undefined
              }
            />
          </div>

          {/* ==================================================
              NOTES
          ================================================== */}

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
                operation.notes ??
                ''
              }
              placeholder="Notes concernant l'opération..."
              onChange={value =>
                updateOperation(
                  'notes',
                  value,
                )
              }
              disabled={
                !canEditOperation ||
                saving
              }
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          OLIVES UTILISEES
      ====================================================== */}

      <div
        className="filters"
        style={
          isInProgress
            ? {
                opacity: 0.65,
              }
            : undefined
        }
      >
        <div className="filters-header">
          <div>
            <h3>
              Olives utilisées
            </h3>

            <span>
              Sources d'olives utilisées
              pour cette opération de
              pression
            </span>
          </div>

          {/* ==================================================
              BOUTON AJOUTER
              UNIQUEMENT EN PLANIFIE
              ET TOUT A DROITE
          ================================================== */}

          {canEditInputs &&
            !showAddInput && (
              <div
                style={{
                  marginLeft: 'auto',
                }}
              >
                <Button
                  variant="secondary"
                  onClick={
                    handleOpenAddInput
                  }
                  disabled={saving}
                >
                  <AddIcon fontSize="small" />
                  Ajouter
                </Button>
              </div>
            )}
        </div>

        {/* ==================================================
            LISTE SOURCES
        ================================================== */}

        <div className="filters-content">
          {operation.inputs.length ===
          0 ? (
            <div
              style={{
                gridColumn:
                  '1 / -1',
              }}
            >
              Aucune source
              d'olives.
            </div>
          ) : (
            <div
              style={{
                gridColumn:
                  '1 / -1',
                overflowX:
                  'auto',
              }}
            >
              <table
                style={{
                  width:
                    '100%',
                  borderCollapse:
                    'collapse',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '10px',
                      }}
                    >
                      Type
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '10px',
                      }}
                    >
                      Référence
                    </th>

                    <th
                      style={{
                        textAlign:
                          'right',
                        padding:
                          '10px',
                      }}
                    >
                      Quantité
                    </th>

                    {canEditInputs && (
                      <th
                        style={{
                          width:
                            '60px',
                        }}
                      />
                    )}
                  </tr>
                </thead>

                <tbody>
                  {operation.inputs.map(
                    input => (
                      <tr
                        key={
                          input.id
                        }
                      >
                        {/* =================================
                            TYPE
                        ================================= */}

                        <td
                          style={{
                            padding:
                              '10px',
                          }}
                        >
                          {input.sourceType ===
                          'harvest'
                            ? 'Récolte'
                            : 'Achat'}
                        </td>

                        {/* =================================
                            REFERENCE
                        ================================= */}

                        <td
                          style={{
                            padding:
                              '10px',
                          }}
                        >
                          {
                            input.reference
                          }
                        </td>

                        {/* =================================
                            QUANTITE
                        ================================= */}

                        <td
                          style={{
                            padding:
                              '10px',
                            textAlign:
                              'right',
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              justifyContent:
                                'flex-end',
                              alignItems:
                                'center',
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
                                    event
                                      .target
                                      .value,
                                  ),
                                )
                              }
                            />

                            <span>
                              kg
                            </span>
                          </div>
                        </td>

                        {/* =================================
                            SUPPRESSION
                            UNIQUEMENT PLANIFIE
                        ================================= */}

                        {canEditInputs && (
                          <td
                            style={{
                              padding:
                                '10px',
                              textAlign:
                                'center',
                            }}
                          >
                            <Button
                              variant="secondary"
                              onClick={() =>
                                handleRemoveInput(
                                  input.id,
                                )
                              }
                              disabled={
                                saving
                              }
                            >
                              Supprimer
                            </Button>
                          </td>
                        )}
                      </tr>
                    ),
                  )}
                </tbody>

                {/* ==========================================
                    TOTAL
                ========================================== */}

                <tfoot>
                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        padding:
                          '15px 10px',
                        fontWeight:
                          'bold',
                      }}
                    >
                      Total
                    </td>

                    <td
                      style={{
                        padding:
                          '15px 10px',
                        textAlign:
                          'right',
                        fontWeight:
                          'bold',
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

        {/* ==================================================
            NOUVELLE SOURCE
            SOUS LA LISTE
            UNE SEULE SOURCE
        ================================================== */}

        {showAddInput &&
          newInput &&
          canEditInputs && (
            <div
              style={{
                padding:
                  '20px',
                borderTop:
                  '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  marginBottom:
                    '15px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  Nouvelle source
                </h3>

                <span>
                  Sélectionnez la
                  récolte ou
                  l'achat à
                  utiliser pour
                  cette pression.
                </span>
              </div>

              <NewPressingOperationInputsWidget
                inputs={[
                  newInput,
                ]}
                errors={
                  newInputErrors
                }

                /*
                 * Le widget demande toujours
                 * ces callbacks, mais on ne veut
                 * aucun bouton "Ajouter" ou
                 * "Supprimer" dans le widget.
                 */
                onAdd={() =>
                  undefined
                }

                onRemove={() =>
                  undefined
                }

                onUpdate={(
                  inputId,
                  field,
                  value,
                ) => {
                  if (
                    inputId !==
                    newInput.id
                  ) {
                    return
                  }

                  handleUpdateNewInput(
                    field,
                    value,
                  )
                }}

                onChangeSource={(
                  inputId,
                  sourceType,
                ) => {
                  if (
                    inputId !==
                    newInput.id
                  ) {
                    return
                  }

                  handleChangeNewInputSource(
                    sourceType,
                  )
                }}

                onSelectSource={(
                  inputId,
                  source,
                ) => {
                  if (
                    inputId !==
                    newInput.id
                  ) {
                    return
                  }

                  handleSelectNewInputSource(
                    source,
                  )
                }}

                showAddButton={
                  false
                }
              />

              {/* ============================================
                  ACTIONS
              ============================================ */}

              <div
                className="filters-footer"
                style={{
                  marginTop:
                    '15px',
                }}
              >
                <Button
                  variant="secondary"
                  onClick={
                    handleCancelAddInput
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
                    handleConfirmAddInput
                  }
                  disabled={
                    saving ||
                    !newInput
                  }
                >
                  <AddIcon fontSize="small" />
                  Ajouter la
                  source
                </Button>
              </div>
            </div>
          )}
      </div>

      {/* ======================================================
          ERREUR
      ====================================================== */}

      {error && (
        <div
          className="field-error"
          style={{
            marginTop:
              '15px',
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      {canEditOperation && (
        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={
              handleCancel
            }
            disabled={
              !dirty ||
              saving
            }
          >
            Annuler
          </Button>

          <Button
            variant="primary"
            onClick={
              handleSave
            }
            disabled={
              !dirty ||
              saving
            }
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