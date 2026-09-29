import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CompleteOilAnalysisDrawer from "../components/CompleteOilAnalysisDrawer";
import OilStorageTransferCard from "../components/OilStorageTransferCard";
import { useOilAnalysisDetailsStore } from "@olive-platform/core/features/analyses/oilAnalyses/stores/UseOilAnalysisDetailsStore";

import Button from "../../../../../common/widgets/button/Button";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import InfoFieldWidget from "../../../../../common/widgets/InfoFieldWidget";
import { OilAnalysisSourceType } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilAnalysisSourceType";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { renderStatus } from "../../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../../common/status/ProductionStatusConfig";
import Card from "../../../../../common/widgets/card/Card";
import OilCategoryBadge from "../../../../../common/widgets/oilCategoryBadge/OilCategoryBadge";
import { usePageTitle } from "../../../../../common/hooks/usePageTitle";
import OilLocationCard from "../components/OilLocationCard";
import { IconBan, IconCheck, IconPlayerPlay } from "@tabler/icons-react";
import { OIL_CATEGORY_LABELS } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { formatOilQuantity } from "@olive-platform/core/features/shared/utils/formatter";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";

type OilAnalysisForm = {
  acidityPercentage?: number;
  peroxideIndex?: number;
  k232?: number;
  k270?: number;
  organolepticGrade?: number;
  plannedDate?: string;
};

const initialForm: OilAnalysisForm = {};

const toOptionalNumber = (value: string): number | undefined => {
  if (value.trim() === "") {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? undefined : number;
};

const formatPlannedDate = (date?: string | null) => {
  if (!date) {
    return "-";
  }

  return new Date(`${date.split("T")[0]}T00:00:00`).toLocaleDateString("fr-FR");
};

const getSourceTypeLabel = (sourceTypeId: OilAnalysisSourceType) => {
  if (sourceTypeId === OilAnalysisSourceType.PressingOperation) {
    return "Opération de pression";
  }

  if (sourceTypeId === OilAnalysisSourceType.Tank) {
    return "Citerne";
  }

  return "-";
};

export default function OilAnalysisDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    analysis,
    loading,
    saving,
    error,
    fetchAnalysis,
    update,
    start,
    complete,
    abandon,
    clear,
  } = useOilAnalysisDetailsStore();

  const [form, setForm] = useState<OilAnalysisForm>(initialForm);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [completeDrawerOpen, setCompleteDrawerOpen] = useState(false);

  usePageTitle(
    analysis ? `Analyse d'huile ${analysis.reference}` : "Analyse d'huile",
    "Contrôle de l'huile produite et position de l'huile en citerne.",
  );

  const isPlanned = analysis?.status === ProductionStatus.Planned;

  const isInProgress = analysis?.status === ProductionStatus.InProgress;

  const isCompleted = analysis?.status === ProductionStatus.Completed;

  const isCancelled = analysis?.status === ProductionStatus.Cancelled;

  const fieldsDisabled = saving || isCompleted || isCancelled;

  useEffect(() => {
    if (!id) {
      return;
    }

    const analysisId = Number(id);

    if (Number.isNaN(analysisId) || analysisId <= 0) {
      return;
    }

    fetchAnalysis(analysisId);

    return () => clear();
  }, [id, fetchAnalysis, clear]);

  useEffect(() => {
    if (!analysis) {
      return;
    }

    setForm({
      acidityPercentage: analysis.acidityPercentage ?? undefined,

      peroxideIndex: analysis.peroxideIndex ?? undefined,

      k232: analysis.k232 ?? undefined,

      k270: analysis.k270 ?? undefined,

      organolepticGrade: analysis.organolepticGrade ?? undefined,

      plannedDate: analysis.plannedDate
        ? analysis.plannedDate.split("T")[0]
        : "",
    });

    setErrors({});
  }, [analysis]);

  const validateForm = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    const isPercentageInvalid = (value?: number) =>
      value !== undefined && (value < 0 || value > 100);

    if (isPercentageInvalid(form.acidityPercentage)) {
      validationErrors.acidityPercentage =
        "L'acidité doit être comprise entre 0 et 100 %.";
    }

    return validationErrors;
  }, [form]);

  const updateForm = useCallback(
    <K extends keyof OilAnalysisForm>(field: K, value: OilAnalysisForm[K]) => {
      if (isCompleted || isCancelled) {
        return;
      }

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setErrors((previous) => {
        if (!previous[field]) {
          return previous;
        }

        const next = { ...previous };

        delete next[field];

        return next;
      });
    },
    [isCompleted, isCancelled],
  );

  const buildUpdateRequest = useCallback(
    () => ({
      acidityPercentage: form.acidityPercentage,

      peroxideIndex: form.peroxideIndex,

      k232: form.k232,

      k270: form.k270,

      // La date d'analyse est gérée par l'API.
      organolepticGrade: form.organolepticGrade,
    }),
    [form],
  );

  /**
   * Lancer l'analyse
   */
  const handleStart = useCallback(async () => {
    if (!analysis || !isPlanned || saving) {
      return;
    }

    try {
      await start(analysis.id);

      toast.success("L'analyse d'huile a été lancée avec succès.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de lancer l'analyse d'huile.",
      );
    }
  }, [analysis, isPlanned, saving, start]);

  /**
   * Enregistrer les modifications
   */
  const handleSubmit = useCallback(async () => {
    if (!analysis || !isInProgress || saving) {
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error("Veuillez corriger les erreurs du formulaire.");

      return;
    }

    try {
      await update(analysis.id, buildUpdateRequest());

      setErrors({});

      toast.success("Analyse d'huile modifiée avec succès.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de modifier l'analyse d'huile.";

      toast.error(message);

      setErrors({
        general: message,
      });
    }
  }, [
    analysis,
    isInProgress,
    saving,
    validateForm,
    buildUpdateRequest,
    update,
  ]);

  /**
   * Ouvrir le drawer de clôture
   */
  const handleOpenCompleteDrawer = useCallback(() => {
    if (!analysis || !isInProgress || saving) {
      return;
    }

    const validationErrors = validateForm();

    // L'acidité est indispensable pour classer l'huile.
    if (form.acidityPercentage === undefined) {
      validationErrors.acidityPercentage =
        "L'acidité est obligatoire pour clôturer l'analyse.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error(
        "Veuillez corriger les erreurs du formulaire avant de clôturer.",
      );

      return;
    }

    setErrors({});
    setCompleteDrawerOpen(true);
  }, [analysis, isInProgress, saving, validateForm, form.acidityPercentage]);

  /**
   * Fermer le drawer
   */
  const handleCloseCompleteDrawer = useCallback(() => {
    if (!saving) {
      setCompleteDrawerOpen(false);
    }
  }, [saving]);

  /**
   * Clôturer l'analyse
   */
  const handleComplete = useCallback(async () => {
    if (!analysis || !isInProgress || saving) {
      return;
    }

    try {
      await complete(analysis.id, buildUpdateRequest());

      setCompleteDrawerOpen(false);

      toast.success("L'analyse d'huile a été clôturée avec succès.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de clôturer l'analyse d'huile.";

      toast.error(message);

      setErrors({
        general: message,
      });
    }
  }, [analysis, isInProgress, saving, complete, buildUpdateRequest]);

  /**
   * Abandonner l'analyse
   */
  const handleAbandon = useCallback(async () => {
    if (!analysis || saving) {
      return;
    }

    const confirmed = window.confirm(
      "Voulez-vous vraiment abandonner cette analyse d'huile ?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await abandon(analysis.id);

      toast.success("L'analyse d'huile a été abandonnée avec succès.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d'abandonner l'analyse d'huile.",
      );
    }
  }, [analysis, saving, abandon]);

  const hasInvalidId = !id || Number.isNaN(Number(id)) || Number(id) <= 0;

  const showResults = isInProgress || isCompleted;

  if (hasInvalidId || (!loading && (error || !analysis))) {
    return (
      <div className="feature-page">
        <div className="error-message">
          {hasInvalidId
            ? "Identifiant de l'analyse invalide."
            : error ?? "Analyse d'huile introuvable."}
        </div>
      </div>
    );
  }

  if (loading || !analysis) {
    return (
      <div className="feature-page">
        <div className="loading">Chargement de l'analyse d'huile...</div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      {/* ==================== STATUT ET ACTIONS ==================== */}

      <div className="page-header">
        <div className="page-header-content">
          {renderStatus(analysis.status, productionStatusConfig)}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {(isPlanned || isInProgress) && (
            <Button variant="secondary" onClick={handleAbandon} disabled={saving}>
              <IconBan size={16} />
              Abandonner l'analyse
            </Button>
          )}

          {isPlanned && (
            <Button variant="primary" onClick={handleStart} disabled={saving}>
              <IconPlayerPlay size={16} />
              {saving ? "Lancement..." : "Lancer l'analyse"}
            </Button>
          )}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleOpenCompleteDrawer}
              disabled={saving}
            >
              <IconCheck size={16} />
              Clôturer l'analyse
            </Button>
          )}
        </div>
      </div>

      {/* ==================== INFORMATIONS GÉNÉRALES ==================== */}

      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Informations générales</h3>
              <span>Informations relatives à l'analyse</span>
            </div>
          </div>

          <div className="info-grid">
            <InfoFieldWidget
              label="Type de source"
              value={getSourceTypeLabel(analysis.sourceTypeId)}
            />
            <InfoFieldWidget
              label="Référence de la source"
              value={analysis.sourceReference ?? "-"}
            />
            <InfoFieldWidget
              label="Huile produite"
              value={formatOilQuantity(analysis.oilQuantityLiters)}
            />
            <InfoFieldWidget
              label="Date d'analyse"
              value={formatPlannedDate(form.plannedDate)}
            />
            <InfoFieldWidget
              label="Début"
              value={formatStringToDateTime(analysis.startTime)}
            />
            <InfoFieldWidget
              label="Fin"
              value={formatStringToDateTime(analysis.endTime)}
            />
          </div>
        </div>
      </Card>

      {/* ==================== POSITION DE L'HUILE ==================== */}

      <OilLocationCard
        locations={analysis.oilLocations}
        oilQuantityLiters={analysis.oilQuantityLiters}
      />

      {/* ==================== RÉSULTATS ==================== */}

      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Résultats de l'analyse</h3>
              <span>Résultats du contrôle physico-chimique de l'huile.</span>
            </div>

            {/* Catégorie officielle : fixée par l'API à la clôture de l'analyse. */}
            {isCompleted ? (
              <OilCategoryBadge category={analysis.oilCategory}>
                {analysis.oilCategory
                  ? `Catégorie : ${OIL_CATEGORY_LABELS[analysis.oilCategory]}`
                  : "Catégorie non déterminée"}
              </OilCategoryBadge>
            ) : (
              isInProgress && (
                <span className="tank-cell__sub">
                  La catégorie sera déterminée à la clôture de l'analyse.
                </span>
              )
            )}
          </div>

          {!showResults ? (
            <InfoFieldWidget
              label="Résultats"
              value={
                isCancelled
                  ? "Analyse abandonnée."
                  : "Les résultats se saisissent une fois l'analyse lancée."
              }
            />
          ) : (
            <div className="info-grid">
              <div className="filter-item">
                <TextInput
                  label="Acidité (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.acidityPercentage ?? ""}
                  onChange={(event) =>
                    updateForm("acidityPercentage", toOptionalNumber(event.target.value))
                  }
                  disabled={fieldsDisabled}
                />
                {errors.acidityPercentage && (
                  <span className="field-error">{errors.acidityPercentage}</span>
                )}
              </div>

              <div className="filter-item">
                <TextInput
                  label="Indice de peroxyde (meq O₂/kg)"
                  type="number"
                  step="0.01"
                  value={form.peroxideIndex ?? ""}
                  onChange={(event) =>
                    updateForm("peroxideIndex", toOptionalNumber(event.target.value))
                  }
                  disabled={fieldsDisabled}
                />
              </div>

              <div className="filter-item">
                <TextInput
                  label="K232"
                  type="number"
                  step="0.001"
                  value={form.k232 ?? ""}
                  onChange={(event) =>
                    updateForm("k232", toOptionalNumber(event.target.value))
                  }
                  disabled={fieldsDisabled}
                />
              </div>

              <div className="filter-item">
                <TextInput
                  label="K270"
                  type="number"
                  step="0.001"
                  value={form.k270 ?? ""}
                  onChange={(event) =>
                    updateForm("k270", toOptionalNumber(event.target.value))
                  }
                  disabled={fieldsDisabled}
                />
              </div>

              <div className="filter-item">
                <TextInput
                  label="Classification organoleptique"
                  type="number"
                  value={form.organolepticGrade ?? ""}
                  onChange={(event) =>
                    updateForm("organolepticGrade", toOptionalNumber(event.target.value))
                  }
                  disabled={fieldsDisabled}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ==================== STOCKAGE ==================== */}
      {/* Analyse terminée d'une pression : son huile passe de la tampon au stockage. */}
      {isCompleted && analysis.sourceTypeId === OilAnalysisSourceType.PressingOperation && (
        <OilStorageTransferCard
          oilAnalysisId={analysis.id}
          category={analysis.oilCategory}
          locations={analysis.oilLocations}
          onTransferred={() => fetchAnalysis(analysis.id)}
        />
      )}

      {errors.general && (
        <div className="field-error">{errors.general}</div>
      )}

      {/* ==================== BARRE D'ACTIONS ==================== */}
      {/* Saisie des résultats : seulement pendant l'analyse. */}

      {isInProgress && (
        <>
          <div className="fixed-actions-spacer" />

          <div className="fixed-actions-bar">
            <Button variant="primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </>
      )}

      {/* ==================== DRAWER CLÔTURE ==================== */}

      <CompleteOilAnalysisDrawer
        open={completeDrawerOpen}
        saving={saving}
        reference={analysis.reference}
        sourceLabel={`${getSourceTypeLabel(analysis.sourceTypeId)} — ${
          analysis.sourceReference ?? "-"
        }`}
        plannedDateLabel={formatPlannedDate(form.plannedDate)}
        acidityPercentage={form.acidityPercentage}
        peroxideIndex={form.peroxideIndex}
        k232={form.k232}
        k270={form.k270}
        organolepticGrade={form.organolepticGrade}
        onClose={handleCloseCompleteDrawer}
        onConfirm={handleComplete}
      />
    </div>
  );
}
