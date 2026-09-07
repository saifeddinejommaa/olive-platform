import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CompleteOilAnalysisDrawer from "../components/CompleteOilAnalysisDrawer";
import { useOilAnalysisDetailsStore } from "../stores/UseOilAnalysisDetailsStore";

import { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import { renderStatus } from "../../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../../shared/status/ProductionStatusConfig";
import { OilAnalysisSourceType } from "../../domain/entities/OilAnalysisSourceType";

import Button from "../../../../../common/widgets/button/Button";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import InfoFieldWidget from "../../../../../common/widgets/InfoFieldWidget";

type OilAnalysisForm = {
  acidityPercentage?: number;
  peroxideIndex?: number;
  k232?: number;
  k270?: number;
  organolepticGrade?: number;
  analysisDate?: string;
};

const initialForm: OilAnalysisForm = {};

const toOptionalNumber = (value: string): number | undefined => {
  if (value.trim() === "") {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? undefined : number;
};

const formatAnalysisDate = (date?: string | null) => {
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
  const navigate = useNavigate();
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

      analysisDate: analysis.analysisDate
        ? analysis.analysisDate.split("T")[0]
        : "",
    });

    setErrors({});
  }, [analysis]);

  const validateForm = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    const isPercentageInvalid = (value?: number) =>
      value !== undefined && (value < 0 || value > 100);

    if (!form.analysisDate) {
      validationErrors.analysisDate = "La date d'analyse est obligatoire.";
    }

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

      organolepticGrade: form.organolepticGrade,

      analysisDate: form.analysisDate
        ? new Date(`${form.analysisDate}T00:00:00`).toISOString()
        : undefined,
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

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error(
        "Veuillez corriger les erreurs du formulaire avant de clôturer.",
      );

      return;
    }

    setErrors({});
    setCompleteDrawerOpen(true);
  }, [analysis, isInProgress, saving, validateForm]);

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

  /**
   * Retour à la liste
   */
  const handleBack = useCallback(() => {
    if (!saving) {
      navigate("/oil-analyses");
    }
  }, [saving, navigate]);

  const hasInvalidId = !id || Number.isNaN(Number(id)) || Number(id) <= 0;

  const headerReference = analysis?.reference ? ` ${analysis.reference}` : "";

  /**
   * ID invalide
   */
  if (hasInvalidId) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'huile
              {headerReference}
            </h1>
          </div>
        </div>

        <div className="error-message">Identifiant de l'analyse invalide.</div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleBack}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Chargement
   */
  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'huile
              {headerReference}
            </h1>
          </div>
        </div>

        <div className="loading">Chargement de l'analyse d'huile...</div>
      </div>
    );
  }

  /**
   * Erreur
   */
  if (error || !analysis) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              Analyse d'huile
              {headerReference}
            </h1>
          </div>
        </div>

        <div className="error-message">
          {error ?? "Analyse d'huile introuvable."}
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleBack}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      {/* ==================== HEADER ==================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Analyse d'huile {analysis.reference}</h1>

          <div>{renderStatus(analysis.status, productionStatusConfig)}</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* Abandonner */}
          {(isPlanned || isInProgress) && (
            <Button
              variant="secondary"
              onClick={handleAbandon}
              disabled={saving}
            >
              {saving ? "Abandon..." : "Abandonner"}
            </Button>
          )}

          {/* Lancer */}
          {isPlanned && (
            <Button variant="primary" onClick={handleStart} disabled={saving}>
              {saving ? "Lancement..." : "Lancer l'analyse"}
            </Button>
          )}

          {/* Clôturer */}
          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleOpenCompleteDrawer}
              disabled={saving}
            >
              Clôturer l'analyse
            </Button>
          )}
        </div>
      </div>

      {/* ==================== INFORMATIONS GÉNÉRALES ==================== */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>

            <span>Informations relatives à l'analyse</span>
          </div>
        </div>

        <div className="filters-content">
          <InfoFieldWidget
            label="Type de source"
            value={getSourceTypeLabel(analysis.sourceTypeId)}
          />

          <InfoFieldWidget
            label="Référence de la source"
            value={analysis.sourceReference ?? "-"}
          />

          <InfoFieldWidget
            label="Date d'analyse"
            value={formatAnalysisDate(form.analysisDate)}
          />

          <InfoFieldWidget
            label="Référence de l'analyse"
            value={analysis.reference}
          />
        </div>
      </div>

      {/* ==================== RÉSULTATS ==================== */}

      <div
        className="filters"
        style={{
          marginTop: "20px",
        }}
      >
        <div className="filters-header">
          <div>
            <h3>Résultats de l'analyse</h3>

            <span>Résultats du contrôle physico-chimique de l'huile.</span>
          </div>
        </div>

        <div className="filters-content">
          {/* Acidité */}

          <div className="filter-item">
            <TextInput
              label="Acidité (%)"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.acidityPercentage ?? ""}
              onChange={(event) =>
                updateForm(
                  "acidityPercentage",
                  toOptionalNumber(event.target.value),
                )
              }
              disabled={fieldsDisabled}
            />

            {errors.acidityPercentage && (
              <span className="field-error">{errors.acidityPercentage}</span>
            )}
          </div>

          {/* Indice de peroxyde */}

          <div className="filter-item">
            <TextInput
              label="Indice de peroxyde"
              type="number"
              step="0.01"
              value={form.peroxideIndex ?? ""}
              onChange={(event) =>
                updateForm(
                  "peroxideIndex",
                  toOptionalNumber(event.target.value),
                )
              }
              disabled={fieldsDisabled}
            />
          </div>

          {/* K232 */}

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

          {/* K270 */}

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

          {/* Classification organoleptique */}

          <div className="filter-item">
            <TextInput
              label="Classification organoleptique"
              type="number"
              value={form.organolepticGrade ?? ""}
              onChange={(event) =>
                updateForm(
                  "organolepticGrade",
                  toOptionalNumber(event.target.value),
                )
              }
              disabled={fieldsDisabled}
            />
          </div>

          {/* Date d'analyse */}

          <div className="filter-item">
            <TextInput
              label="Date d'analyse"
              type="date"
              value={form.analysisDate ?? ""}
              onChange={(event) =>
                updateForm("analysisDate", event.target.value)
              }
              disabled={fieldsDisabled}
            />

            {errors.analysisDate && (
              <span className="field-error">{errors.analysisDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* ==================== ERREUR GÉNÉRALE ==================== */}

      {errors.general && (
        <div
          className="field-error"
          style={{
            marginTop: "15px",
          }}
        >
          {errors.general}
        </div>
      )}

      {/* ==================== FOOTER ==================== */}

      <div className="filters-footer">
        <Button variant="secondary" onClick={handleBack} disabled={saving}>
          Retour
        </Button>

        {isInProgress && (
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        )}
      </div>

      {/* ==================== DRAWER CLÔTURE ==================== */}

      <CompleteOilAnalysisDrawer
        open={completeDrawerOpen}
        saving={saving}
        reference={analysis.reference}
        sourceLabel={`${getSourceTypeLabel(analysis.sourceTypeId)} — ${
          analysis.sourceReference ?? "-"
        }`}
        analysisDateLabel={formatAnalysisDate(form.analysisDate)}
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
