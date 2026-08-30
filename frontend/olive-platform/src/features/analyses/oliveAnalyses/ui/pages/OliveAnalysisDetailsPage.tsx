import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import { toast } from 'react-toastify'

import Button from '../../../../../common/widgets/button/Button'
import Select from '../../../../../common/widgets/select/Select'
import TextInput from '../../../../../common/widgets/textInput/TextInput'

import type { UpdateOliveAnalysisParams } from '../../domain/params/UpdateOliveAnalysisParams'

import { useOliveAnalysisDetailsStore } from '../store/OliveAnalysisDetailsStore'

import { ProductionStatus } from '../../../../production/domain/entities/ProductionStatus'
import { renderStatus } from '../../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../../shared/status/ProductionStatusConfig'

/* ============================================================
 * FORMULAIRE
 * ============================================================ */

type OliveAnalysisForm = {
  reference: string
  sourceTypeId: number
  sourceReference: string
  humidityPercentage?: number
  waterPercentage?: number
  oilPercentage?: number
  acidityPercentage?: number
  analysisDate?: string
}

const initialForm: OliveAnalysisForm = {
  reference: '',
  sourceTypeId: 0,
  sourceReference: '',
  humidityPercentage: undefined,
  waterPercentage: undefined,
  oilPercentage: undefined,
  acidityPercentage: undefined,
  analysisDate: '',
}

/* ============================================================
 * PAGE
 * ============================================================ */

export default function OliveAnalysisDetailsPage() {
  const navigate = useNavigate()

  const { id } = useParams<{
    id: string
  }>()

  /* ==========================================================
   * STORE
   * ========================================================== */

  const {
    analysis,
    loading,
    saving,
    error,
    fetchAnalysis,
    update,
    start,
    complete,
    clear,
  } = useOliveAnalysisDetailsStore()

  /* ==========================================================
   * FORMULAIRE LOCAL
   * ========================================================== */

  const [form, setForm] =
    useState<OliveAnalysisForm>(initialForm)

  const [errors, setErrors] =
    useState<Record<string, string>>({})

  /* ==========================================================
   * TYPES DE SOURCES
   * ========================================================== */

  const sourceTypeOptions = useMemo(
    () => [
      {
        value: '0',
        label: 'Sélectionnez un type de source',
      },
      {
        value: '1',
        label: 'Récolte',
      },
      {
        value: '2',
        label: "Achat d'olives",
      },
    ],
    [],
  )

  /* ==========================================================
   * STATUT
   * ========================================================== */

  const isPlanned =
    analysis?.status === ProductionStatus.Planned

  const isInProgress =
    analysis?.status === ProductionStatus.InProgress

  const isCompleted =
    analysis?.status === ProductionStatus.Completed

  /* ==========================================================
   * AFFICHAGE DES RÉSULTATS
   *
   * PLANIFIÉ  → résultats invisibles
   * EN COURS  → résultats visibles
   * CLÔTURÉ   → résultats visibles
   * ========================================================== */

  const showResults =
    isInProgress || isCompleted

  /* ==========================================================
   * CHAMPS DÉSACTIVÉS
   *
   * - pendant une sauvegarde
   * - lorsque l'analyse est clôturée
   * ========================================================== */

  const fieldsDisabled =
    saving || isCompleted

  /* ==========================================================
   * CHARGEMENT DE L'ANALYSE
   * ========================================================== */

  useEffect(() => {
    if (!id) return

    const analysisId = Number(id)

    if (
      Number.isNaN(analysisId) ||
      analysisId <= 0
    ) {
      return
    }

    fetchAnalysis(analysisId)

    return () => {
      clear()
    }
  }, [
    id,
    fetchAnalysis,
    clear,
  ])

  /* ==========================================================
   * REMPLISSAGE DU FORMULAIRE
   * ========================================================== */

  useEffect(() => {
    if (!analysis) return
    console.log(analysis)
    setForm({
      reference:
        analysis.reference ?? '',

      sourceTypeId:
        analysis.sourceTypeId ?? 0,

      sourceReference:
        analysis.sourceReference ?? '',

      humidityPercentage:
        analysis.humidityPercentage ??
        undefined,

      waterPercentage:
        analysis.waterPercentage ??
        undefined,

      oilPercentage:
        analysis.oilPercentage ??
        undefined,

      acidityPercentage:
        analysis.acidityPercentage ??
        undefined,

      analysisDate:
        analysis.analysisDate
          ? new Date(
              analysis.analysisDate,
            )
              .toISOString()
              .split('T')[0]
          : '',
    })

    setErrors({})
  }, [analysis])

  /* ==========================================================
   * VALIDATION
   * ========================================================== */

  const getValidationErrors =
    useCallback((): Record<string, string> => {
      const validationErrors: Record<
        string,
        string
      > = {}

      /* ------------------------------------------------------
       * TYPE DE SOURCE
       * ------------------------------------------------------ */

      if (!form.sourceTypeId) {
        validationErrors.sourceTypeId =
          'Le type de source est obligatoire.'
      }

      /* ------------------------------------------------------
       * SOURCE
       * ------------------------------------------------------ */

      if (
        !form.sourceReference ||
        form.sourceReference.trim() === ''
      ) {
        validationErrors.sourceId =
          'La source est obligatoire.'
      }

      /* ------------------------------------------------------
       * DATE
       * ------------------------------------------------------ */

      if (!form.analysisDate) {
        validationErrors.analysisDate =
          "La date d'analyse est obligatoire."
      }

      /* ------------------------------------------------------
       * HUMIDITÉ
       * ------------------------------------------------------ */

      if (
        form.humidityPercentage !==
          undefined &&
        (
          form.humidityPercentage < 0 ||
          form.humidityPercentage > 100
        )
      ) {
        validationErrors.humidityPercentage =
          "L'humidité doit être comprise entre 0 et 100 %."
      }

      /* ------------------------------------------------------
       * EAU
       * ------------------------------------------------------ */

      if (
        form.waterPercentage !==
          undefined &&
        (
          form.waterPercentage < 0 ||
          form.waterPercentage > 100
        )
      ) {
        validationErrors.waterPercentage =
          "Le pourcentage d'eau doit être compris entre 0 et 100 %."
      }

      /* ------------------------------------------------------
       * HUILE
       * ------------------------------------------------------ */

      if (
        form.oilPercentage !==
          undefined &&
        (
          form.oilPercentage < 0 ||
          form.oilPercentage > 100
        )
      ) {
        validationErrors.oilPercentage =
          "Le pourcentage d'huile doit être compris entre 0 et 100 %."
      }

      /* ------------------------------------------------------
       * ACIDITÉ
       * ------------------------------------------------------ */

      if (
        form.acidityPercentage !==
          undefined &&
        (
          form.acidityPercentage < 0 ||
          form.acidityPercentage > 100
        )
      ) {
        validationErrors.acidityPercentage =
          "L'acidité doit être comprise entre 0 et 100 %."
      }

      return validationErrors
    }, [form])

  /* ==========================================================
   * MISE À JOUR DU FORMULAIRE
   * ========================================================== */

  const updateForm = useCallback(
    <K extends keyof OliveAnalysisForm>(
      field: K,
      value: OliveAnalysisForm[K],
    ) => {
      if (isCompleted) return

      setForm(previous => ({
        ...previous,
        [field]: value,
      }))

      setErrors(previous => {
        if (!previous[field]) {
          return previous
        }

        const next = {
          ...previous,
        }

        delete next[field]

        return next
      })

      /*
       * Le champ source utilise la clé sourceId
       * pour l'affichage de l'erreur.
       */
      if (field === 'sourceReference') {
        setErrors(previous => {
          if (!previous.sourceId) {
            return previous
          }

          const next = {
            ...previous,
          }

          delete next.sourceId

          return next
        })
      }
    },
    [isCompleted],
  )

  /* ==========================================================
   * CONVERSION DES NOMBRES
   * ========================================================== */

  const parseOptionalNumber = (
    value: string,
  ): number | undefined => {
    if (value.trim() === '') {
      return undefined
    }

    const number = Number(value)

    return Number.isNaN(number)
      ? undefined
      : number
  }

  /* ==========================================================
   * LANCER L'ANALYSE
   * ========================================================== */

  const handleStart = useCallback(
    async () => {
      if (!analysis) return

      if (!isPlanned) return

      try {
        await start(analysis.id)

        /*
         * Recharge les détails afin de récupérer
         * le nouveau statut EN COURS.
         */
        await fetchAnalysis(analysis.id)

        toast.success(
          "L'analyse d'olive a été lancée avec succès.",
        )
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de lancer l'analyse d'olive."

        toast.error(message)
      }
    },
    [
      analysis,
      isPlanned,
      start,
      fetchAnalysis,
    ],
  )

  /* ==========================================================
   * CONSTRUCTION DE LA REQUÊTE
   * ========================================================== */

  const buildUpdateRequest =
    useCallback(
      (
        analysisId: number,
      ): UpdateOliveAnalysisParams => ({
        id: analysisId,

        sourceTypeId:
          form.sourceTypeId,

        sourceReference:
          form.sourceReference,

        humidityPercentage:
          form.humidityPercentage,

        waterPercentage:
          form.waterPercentage,

        oilPercentage:
          form.oilPercentage,

        acidityPercentage:
          form.acidityPercentage,

        analysisDate:
          form.analysisDate,
      }),
      [form],
    )

  /* ==========================================================
   * ENREGISTRER LES MODIFICATIONS
   *
   * Disponible uniquement lorsque :
   *
   * productionStatus = EN COURS
   * ========================================================== */

  const handleSubmit = useCallback(
    async () => {
      if (!analysis) return

      if (isCompleted) return

      if (!isInProgress) return

      const validationErrors =
        getValidationErrors()

      if (
        Object.keys(validationErrors)
          .length > 0
      ) {
        setErrors(validationErrors)

        toast.error(
          'Veuillez corriger les erreurs du formulaire.',
        )

        return
      }

      try {
        const request =
          buildUpdateRequest(
            analysis.id,
          )

        await update(
          analysis.id,
          request,
        )

        /*
         * Recharge les détails afin de garder
         * le formulaire synchronisé avec l'API.
         */
        await fetchAnalysis(
          analysis.id,
        )

        toast.success(
          "Analyse d'olive modifiée avec succès.",
        )
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de modifier l'analyse d'olive."

        toast.error(message)

        setErrors({
          general: message,
        })
      }
    },
    [
      analysis,
      isCompleted,
      isInProgress,
      getValidationErrors,
      buildUpdateRequest,
      update,
      fetchAnalysis,
    ],
  )

  /* ==========================================================
   * CLÔTURER L'ANALYSE
   *
   * Disponible uniquement lorsque :
   *
   * productionStatus = EN COURS
   * ========================================================== */

  const handleComplete =
    useCallback(async () => {
      if (!analysis) return

      if (!isInProgress) return

      const validationErrors =
        getValidationErrors()

      if (
        Object.keys(validationErrors)
          .length > 0
      ) {
        setErrors(validationErrors)

        toast.error(
          'Veuillez corriger les erreurs du formulaire avant de clôturer.',
        )

        return
      }

      try {
        const request =
          buildUpdateRequest(
            analysis.id,
          )

        /*
         * Sauvegarde les dernières modifications
         * et clôture l'analyse.
         */
        await complete(
          analysis.id,
          request,
        )

        /*
         * Recharge les détails afin de récupérer
         * le nouveau statut CLÔTURÉ.
         */
        await fetchAnalysis(
          analysis.id,
        )

        toast.success(
          "L'analyse d'olive a été clôturée avec succès.",
        )
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de clôturer l'analyse d'olive."

        toast.error(message)

        setErrors({
          general: message,
        })
      }
    }, [
      analysis,
      isInProgress,
      getValidationErrors,
      buildUpdateRequest,
      complete,
      fetchAnalysis,
    ])

  /* ==========================================================
   * RETOUR
   * ========================================================== */

  const handleBack = useCallback(() => {
    if (!saving) {
      navigate('/Olive-analyses')
    }
  }, [
    saving,
    navigate,
  ])

  /* ==========================================================
   * HEADER
   *
   * Comme dans HarvestDetailsPage :
   *
   * - le header existe même si l'analyse n'est pas encore
   *   chargée
   * - on ne fait jamais analysis.reference sans vérifier
   *   que analysis existe
   * - le statut est affiché uniquement si disponible
   * ========================================================== */

  const headerReference =
    analysis?.reference
      ? ` ${analysis.reference}`
      : ''

  /* ==========================================================
   * ID INVALIDE
   * ========================================================== */

  if (
    !id ||
    Number.isNaN(Number(id)) ||
    Number(id) <= 0
  ) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'olive
              {headerReference}
            </h1>

            <p className="page-description">
              Consultation de l'analyse.
            </p>

            {analysis && (
              <div>
                {renderStatus(
                  analysis.status,
                  productionStatusConfig,
                )}
              </div>
            )}
          </div>
        </div>

        <div className="error-message">
          Identifiant de l'analyse invalide.
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

  /* ==========================================================
   * LOADING
   * ========================================================== */

  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'olive
              {headerReference}
            </h1>

            <p className="page-description">
              Consultation de l'analyse.
            </p>

            {analysis && (
              <div>
                {renderStatus(
                  analysis.status,
                  productionStatusConfig,
                )}
              </div>
            )}
          </div>
        </div>

        <div className="loading">
          Chargement de l'analyse d'olive...
        </div>
      </div>
    )
  }

  /* ==========================================================
   * ERREUR
   * ========================================================== */

  if (error) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'olive
              {headerReference}
            </h1>

            <p className="page-description">
              Consultation de l'analyse.
            </p>

            {analysis && (
              <div>
                {renderStatus(
                  analysis.status,
                  productionStatusConfig,
                )}
              </div>
            )}
          </div>
        </div>

        <div className="error-message">
          {error}
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

  /* ==========================================================
   * ANALYSE NON TROUVÉE
   * ========================================================== */

  if (!analysis) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'olive
            </h1>

            <p className="page-description">
              Consultation de l'analyse.
            </p>
          </div>
        </div>

        <div className="error-message">
          Analyse d'olive introuvable.
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

  /* ==========================================================
   * PAGE
   * ========================================================== */

  return (
    <div className="feature-page">

      {/* ======================================================
       * HEADER
       * ====================================================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Analyse d'olive {analysis.reference}
          </h1>

          <div>
            {renderStatus(
              analysis.status,
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
            <Button
              variant="primary"
              onClick={handleStart}
              disabled={saving}
            >
              {saving
                ? 'Lancement...'
                : "Lancer l'analyse"}
            </Button>
          )}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={saving}
            >
              {saving
                ? 'Clôture...'
                : "Clôturer l'analyse"}
            </Button>
          )}
        </div>
      </div>

      {/* ======================================================
       * INFORMATIONS GÉNÉRALES
       * ====================================================== */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>
              Informations générales
            </h3>

            <span>
              Informations relatives à l'analyse
            </span>
          </div>
        </div>

        <div className="filters-content">

          
          {/* ==================================================
           * TYPE SOURCE
           * ================================================== */}

          <div className="filter-item">
            <Select
              label="Type de source"
              value={String(
                form.sourceTypeId,
              )}
              onChange={event =>
                updateForm(
                  'sourceTypeId',
                  Number(
                    event.target.value,
                  ),
                )
              }
              options={
                sourceTypeOptions
              }
              disabled={
                fieldsDisabled
              }
            />

            {errors.sourceTypeId && (
              <span className="field-error">
                {
                  errors.sourceTypeId
                }
              </span>
            )}
          </div>

          {/* ==================================================
           * SOURCE
           * ================================================== */}

          <div className="filter-item">
            <TextInput
              label={
                form.sourceTypeId === 1
                  ? 'Référence de la récolte'
                  : form.sourceTypeId === 2
                    ? "Référence de l'achat"
                    : 'Référence de la source'
              }
              placeholder="ID source"
              min="1"
              value={
                form.sourceReference ||
                ''
              }
              onChange={event =>
                updateForm(
                  'sourceReference',
                  event.target.value,
                )
              }
              disabled={
                fieldsDisabled
              }
            />

            {errors.sourceId && (
              <span className="field-error">
                {errors.sourceId}
              </span>
            )}
          </div>

          {/* ==================================================
           * DATE
           * ================================================== */}

          <div className="filter-item">
            <TextInput
              label="Date d'analyse"
              type="date"
              value={
                form.analysisDate ??
                ''
              }
              onChange={event =>
                updateForm(
                  'analysisDate',
                  event.target.value ||
                    undefined,
                )
              }
              disabled={
                fieldsDisabled
              }
            />

            {errors.analysisDate && (
              <span className="field-error">
                {
                  errors.analysisDate
                }
              </span>
            )}
          </div>

        </div>
      </div>

      {/* ======================================================
       * RÉSULTATS DE L'ANALYSE
       *
       * PLANIFIÉ → invisible
       * EN COURS → visible
       * CLÔTURÉ → visible
       * ====================================================== */}

      {showResults && (
        <div
          className="filters"
          style={{
            marginTop: '20px',
          }}
        >
          <div className="filters-header">
            <div>
              <h3>
                Résultats de l'analyse
              </h3>

              <span>
                Résultats du contrôle
                physico-chimique des olives.
              </span>
            </div>
          </div>

          <div className="filters-content">

            {/* ==================================================
             * HUMIDITÉ
             * ================================================== */}

            <div className="filter-item">
              <TextInput
                label="Humidité (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  form.humidityPercentage ??
                  ''
                }
                onChange={event =>
                  updateForm(
                    'humidityPercentage',
                    parseOptionalNumber(
                      event.target.value,
                    ),
                  )
                }
                disabled={
                  fieldsDisabled
                }
              />

              {errors.humidityPercentage && (
                <span className="field-error">
                  {
                    errors.humidityPercentage
                  }
                </span>
              )}
            </div>

            {/* ==================================================
             * EAU
             * ================================================== */}

            <div className="filter-item">
              <TextInput
                label="Eau (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  form.waterPercentage ??
                  ''
                }
                onChange={event =>
                  updateForm(
                    'waterPercentage',
                    parseOptionalNumber(
                      event.target.value,
                    ),
                  )
                }
                disabled={
                  fieldsDisabled
                }
              />

              {errors.waterPercentage && (
                <span className="field-error">
                  {
                    errors.waterPercentage
                  }
                </span>
              )}
            </div>

            {/* ==================================================
             * HUILE
             * ================================================== */}

            <div className="filter-item">
              <TextInput
                label="Huile (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  form.oilPercentage ??
                  ''
                }
                onChange={event =>
                  updateForm(
                    'oilPercentage',
                    parseOptionalNumber(
                      event.target.value,
                    ),
                  )
                }
                disabled={
                  fieldsDisabled
                }
              />

              {errors.oilPercentage && (
                <span className="field-error">
                  {
                    errors.oilPercentage
                  }
                </span>
              )}
            </div>

            {/* ==================================================
             * ACIDITÉ
             * ================================================== */}

            <div className="filter-item">
              <TextInput
                label="Acidité (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  form.acidityPercentage ??
                  ''
                }
                onChange={event =>
                  updateForm(
                    'acidityPercentage',
                    parseOptionalNumber(
                      event.target.value,
                    ),
                  )
                }
                disabled={
                  fieldsDisabled
                }
              />

              {errors.acidityPercentage && (
                <span className="field-error">
                  {
                    errors.acidityPercentage
                  }
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================
       * ERREUR GÉNÉRALE
       * ====================================================== */}

      {errors.general && (
        <div
          className="field-error"
          style={{
            marginTop: '15px',
          }}
        >
          {errors.general}
        </div>
      )}

      {/* ======================================================
       * FOOTER
       * ====================================================== */}

      <div className="filters-footer">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={saving}
        >
          Retour
        </Button>

        {isInProgress && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? 'Enregistrement...'
              : 'Enregistrer les modifications'}
          </Button>
        )}
      </div>
    </div>
  )
}
