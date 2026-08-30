import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import { toast } from 'react-toastify'

import Button from '../../../../../common/widgets/button/Button'
import Drawer from '../../../../../common/widgets/drawer/Drawer'
import TextInput from '../../../../../common/widgets/textInput/TextInput'

import type { UpdateOliveAnalysisParams } from '../../domain/params/UpdateOliveAnalysisParams'

import { useOliveAnalysisDetailsStore } from '../store/OliveAnalysisDetailsStore'

import { ProductionStatus } from '../../../../production/domain/entities/ProductionStatus'
import { renderStatus } from '../../../../shared/utils/StatusUtils'
import { productionStatusConfig } from '../../../../shared/status/ProductionStatusConfig'
import { getOliveVarietyLabel } from '../../../../appConstants/helper/AppConstantsHelper'

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
  varietyId: number
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
  varietyId: 0,
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
   * DRAWER DE CLÔTURE
   * ========================================================== */

  const [completeDrawerOpen, setCompleteDrawerOpen] =
    useState(false)

  /* ==========================================================
   * STATUT
   * ========================================================== */

  const isPlanned =
    analysis?.status === ProductionStatus.Planned

  const isInProgress =
    analysis?.status === ProductionStatus.InProgress

  const isCompleted =
    analysis?.status === ProductionStatus.Completed

  const showResults =
    isInProgress || isCompleted

  /* ==========================================================
   * CHAMPS DÉSACTIVÉS
   * ========================================================== */

  const fieldsDisabled =
    saving || isCompleted

  /* ==========================================================
   * CHARGEMENT
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

      varietyId:
        analysis.varietyId ?? 0,

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
        validationErrors.sourceReference =
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
        form.humidityPercentage !== undefined &&
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
        form.waterPercentage !== undefined &&
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
        form.oilPercentage !== undefined &&
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
        form.acidityPercentage !== undefined &&
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
   * CONSTRUCTION DE LA REQUÊTE
   * ========================================================== */

  const buildUpdateRequest =
    useCallback(
      (
        analysisId: number,
      ): UpdateOliveAnalysisParams => ({
        id: analysisId,

        humidityPercentage:
          form.humidityPercentage,

        waterPercentage:
          form.waterPercentage,

        oilPercentage:
          form.oilPercentage,

        acidityPercentage:
          form.acidityPercentage,

        analysisDate:
          form.analysisDate
            ? new Date(
                form.analysisDate,
              ).toISOString()
            : undefined,
      }),
      [form],
    )

  /* ==========================================================
   * LANCER L'ANALYSE
   * ========================================================== */

  const handleStart = useCallback(
    async () => {
      if (!analysis) return
      if (!isPlanned) return
      if (saving) return

      try {
        await start(analysis.id)

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
      saving,
      start,
      fetchAnalysis,
    ],
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
      if (saving) return

      const validationErrors =
        getValidationErrors()

      if (
        Object.keys(validationErrors).length > 0
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

        await fetchAnalysis(
          analysis.id,
        )

        setErrors({})

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
      saving,
      getValidationErrors,
      buildUpdateRequest,
      update,
      fetchAnalysis,
    ],
  )

  /* ==========================================================
   * OUVRIR LE DRAWER DE CLÔTURE
   *
   * Aucun appel à complete ici.
   * ========================================================== */

  const handleOpenCompleteDrawer =
    useCallback(() => {
      if (!analysis) return
      if (!isInProgress) return
      if (saving) return

      const validationErrors =
        getValidationErrors()

      if (
        Object.keys(validationErrors).length > 0
      ) {
        setErrors(validationErrors)

        toast.error(
          'Veuillez corriger les erreurs du formulaire avant de clôturer.',
        )

        return
      }

      setErrors({})
      setCompleteDrawerOpen(true)
    }, [
      analysis,
      isInProgress,
      saving,
      getValidationErrors,
    ])

  /* ==========================================================
   * FERMER LE DRAWER
   * ========================================================== */

  const handleCloseCompleteDrawer =
    useCallback(() => {
      if (saving) return

      setCompleteDrawerOpen(false)
    }, [saving])

  /* ==========================================================
   * CLÔTURER L'ANALYSE
   *
   * IMPORTANT :
   *
   * Le clic sur "Confirmer et clôturer" appelle directement
   * complete() du store.
   *
   * La requête contient les dernières valeurs du formulaire.
   * ========================================================== */

  const handleComplete =
    useCallback(async () => {
      if (!analysis) return
      if (!isInProgress) return
      if (saving) return

      const validationErrors =
        getValidationErrors()

      if (
        Object.keys(validationErrors).length > 0
      ) {
        setErrors(validationErrors)

        setCompleteDrawerOpen(false)

        toast.error(
          'Veuillez corriger les erreurs du formulaire avant de clôturer.',
        )

        return
      }

      try {
        /*
         * Construction de la requête avec les valeurs
         * actuellement présentes dans le formulaire.
         */
        const request =
          buildUpdateRequest(
            analysis.id,
          )

        /*
         * APPEL DIRECT AU STORE
         *
         * C'est cet appel qui clôture réellement
         * l'analyse côté backend.
         */
        await complete(
          analysis.id,
          request,
        )

        /*
         * Recharge les données afin de récupérer
         * le nouveau statut Completed.
         */
        await fetchAnalysis(
          analysis.id,
        )

        setCompleteDrawerOpen(false)

        setErrors({})

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
      saving,
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
   * FORMATAGE DATE
   * ========================================================== */

  const formatAnalysisDate = useCallback(
    (date?: string) => {
      if (!date) return '-'

      return new Date(
        `${date}T00:00:00`,
      ).toLocaleDateString('fr-FR')
    },
    [],
  )

  /* ==========================================================
   * LIBELLÉ TYPE SOURCE
   * ========================================================== */

  const sourceTypeLabel =
    form.sourceTypeId === 1
      ? 'Récolte'
      : form.sourceTypeId === 2
        ? "Achat d'olives"
        : '-'

  const sourceReferenceLabel =
    form.sourceTypeId === 1
      ? 'Référence de la récolte'
      : form.sourceTypeId === 2
        ? "Référence de l'achat"
        : 'Référence de la source'

  /* ==========================================================
   * ID INVALIDE
   * ========================================================== */

  const headerReference =
    analysis?.reference
      ? ` ${analysis.reference}`
      : ''

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
              onClick={
                handleOpenCompleteDrawer
              }
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

          {/* TYPE SOURCE */}

          <div className="filter-item">
            <label>
              Type de source
            </label>

            <div
              style={{
                marginTop: '6px',
                fontWeight: 500,
              }}
            >
              {sourceTypeLabel}
            </div>

            {errors.sourceTypeId && (
              <span className="field-error">
                {errors.sourceTypeId}
              </span>
            )}
          </div>

          {/* SOURCE */}

          <div className="filter-item">
            <label>
              {sourceReferenceLabel}
            </label>

            <div
              style={{
                marginTop: '6px',
                fontWeight: 500,
              }}
            >
              {form.sourceReference || '-'}
            </div>

            {errors.sourceReference && (
              <span className="field-error">
                {errors.sourceReference}
              </span>
            )}
          </div>

          {/* VARIÉTÉ */}

          <div className="filter-item">
            <label>
              Variété
            </label>

            <div
              style={{
                marginTop: '6px',
                fontWeight: 500,
              }}
            >
              {getOliveVarietyLabel(
                form.varietyId,
              )}
            </div>
          </div>

          {/* DATE */}

          <div className="filter-item">
            <label>
              Date d'analyse
            </label>

            <div
              style={{
                marginTop: '6px',
                fontWeight: 500,
              }}
            >
              {formatAnalysisDate(
                form.analysisDate,
              )}
            </div>

            {errors.analysisDate && (
              <span className="field-error">
                {errors.analysisDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
       * RÉSULTATS
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

            {/* HUMIDITÉ */}

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
                disabled={fieldsDisabled}
              />

              {errors.humidityPercentage && (
                <span className="field-error">
                  {errors.humidityPercentage}
                </span>
              )}
            </div>

            {/* EAU */}

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
                disabled={fieldsDisabled}
              />

              {errors.waterPercentage && (
                <span className="field-error">
                  {errors.waterPercentage}
                </span>
              )}
            </div>

            {/* HUILE */}

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
                disabled={fieldsDisabled}
              />

              {errors.oilPercentage && (
                <span className="field-error">
                  {errors.oilPercentage}
                </span>
              )}
            </div>

            {/* ACIDITÉ */}

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
                disabled={fieldsDisabled}
              />

              {errors.acidityPercentage && (
                <span className="field-error">
                  {errors.acidityPercentage}
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

      {/* ======================================================
       * DRAWER DE CLÔTURE
       * ====================================================== */}

      <Drawer
        open={completeDrawerOpen}
        title="Clôturer l'analyse"
        description="Vérifiez les informations et les résultats de l'analyse avant de confirmer sa clôture."
        onClose={
          handleCloseCompleteDrawer
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={
                handleCloseCompleteDrawer
              }
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
                : "Confirmer et clôturer"}
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

          {/* ==================================================
           * INFORMATIONS
           * ================================================== */}

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>
              Référence de l'analyse
            </strong>

            <div
              style={{
                marginTop: '4px',
              }}
            >
              {analysis.reference || '-'}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>
              Type de source
            </strong>

            <div
              style={{
                marginTop: '4px',
              }}
            >
              {sourceTypeLabel}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>
              {sourceReferenceLabel}
            </strong>

            <div
              style={{
                marginTop: '4px',
              }}
            >
              {form.sourceReference || '-'}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>
              Variété
            </strong>

            <div
              style={{
                marginTop: '4px',
              }}
            >
              {getOliveVarietyLabel(
                form.varietyId,
              )}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#f8f9fa',
            }}
          >
            <strong>
              Date d'analyse
            </strong>

            <div
              style={{
                marginTop: '4px',
              }}
            >
              {formatAnalysisDate(
                form.analysisDate,
              )}
            </div>
          </div>

          {/* ==================================================
           * RÉSULTATS
           * ================================================== */}

          <div
            style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fafafa',
            }}
          >
            <div
              style={{
                marginBottom: '16px',
              }}
            >
              <strong>
                Résultats de l'analyse
              </strong>

              <div
                style={{
                  marginTop: '4px',
                  fontSize: '13px',
                  color: '#6b7280',
                }}
              >
                Vérifiez les valeurs avant
                de confirmer la clôture.
              </div>
            </div>

            {/* HUMIDITÉ */}

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                padding: '10px 0',
                borderBottom:
                  '1px solid #e5e7eb',
              }}
            >
              <span>
                Humidité
              </span>

              <strong>
                {form.humidityPercentage !==
                undefined
                  ? `${form.humidityPercentage} %`
                  : '-'}
              </strong>
            </div>

            {/* EAU */}

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                padding: '10px 0',
                borderBottom:
                  '1px solid #e5e7eb',
              }}
            >
              <span>
                Eau
              </span>

              <strong>
                {form.waterPercentage !==
                undefined
                  ? `${form.waterPercentage} %`
                  : '-'}
              </strong>
            </div>

            {/* HUILE */}

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                padding: '10px 0',
                borderBottom:
                  '1px solid #e5e7eb',
              }}
            >
              <span>
                Huile
              </span>

              <strong>
                {form.oilPercentage !==
                undefined
                  ? `${form.oilPercentage} %`
                  : '-'}
              </strong>
            </div>

            {/* ACIDITÉ */}

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                padding: '10px 0',
              }}
            >
              <span>
                Acidité
              </span>

              <strong>
                {form.acidityPercentage !==
                undefined
                  ? `${form.acidityPercentage} %`
                  : '-'}
              </strong>
            </div>
          </div>

          {/* ==================================================
           * AVERTISSEMENT
           * ================================================== */}

          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#fff8e1',
              border:
                '1px solid #f0d98c',
            }}
          >
            <strong>
              Confirmation
            </strong>

            <div
              style={{
                marginTop: '6px',
                fontSize: '13px',
              }}
            >
              Une fois l'analyse clôturée,
              les résultats ne pourront plus
              être modifiés.
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

