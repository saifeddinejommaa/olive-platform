import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import type { UpdateOliveAnalysisParams } from "@olive-platform/core/features/analyses/oliveAnalyses/domain/params/UpdateOliveAnalysisParams";
import { useOliveAnalysisDetailsStore } from "@olive-platform/core/features/analyses/oliveAnalyses/store/OliveAnalysisDetailsStore";

import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

import Button from "../../../../../common/widgets/button/Button";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import CompleteOliveAnalysisDrawer from "../widgets/CompleteOliveAnalysisDrawer";
import { usePageTitle } from "../../../../../common/hooks/usePageTitle";
import InfoFieldWidget from "../../../../../common/widgets/InfoFieldWidget";
import Card from "../../../../../common/widgets/card/Card";
import { renderStatus } from "../../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../../common/status/ProductionStatusConfig";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";

type OliveAnalysisForm = {
  reference: string;
  sourceTypeId: number;
  sourceReference: string;
  humidityPercentage?: number;
  waterPercentage?: number;
  oilPercentage?: number;
  acidityPercentage?: number;
  plannedDate?: string;
  varietyId: number;
};

const initialForm: OliveAnalysisForm = {
  reference: "",
  sourceTypeId: 0,
  sourceReference: "",
  humidityPercentage: undefined,
  waterPercentage: undefined,
  oilPercentage: undefined,
  acidityPercentage: undefined,
  plannedDate: "",
  varietyId: 0,
};

const toOptionalNumber = (value: string): number | undefined => {
  if (value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};

const formatPlannedDate = (date?: string) => {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");
};

// Quantité des lots analysés, ex. « 530 kg (5 lots) ».
const formatOliveQuantity = (quantityKg?: number, lotsCount?: number) =>
  quantityKg
    ? `${quantityKg.toLocaleString("fr-FR")} kg${
        lotsCount ? ` (${lotsCount} lot${lotsCount > 1 ? "s" : ""})` : ""
      }`
    : "-";

const getSourceTypeLabel = (sourceTypeId: number) =>
  sourceTypeId === 1 ? "Récolte" : sourceTypeId === 2 ? "Achat d'olives" : "-";

const getSourceReferenceLabel = (sourceTypeId: number) =>
  sourceTypeId === 1
    ? "Référence de la récolte"
    : sourceTypeId === 2
      ? "Référence de l'achat"
      : "Référence de la source";

export default function OliveAnalysisDetailsPage() {
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
    clear,
  } = useOliveAnalysisDetailsStore();

  const [form, setForm] = useState<OliveAnalysisForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completeDrawerOpen, setCompleteDrawerOpen] = useState(false);

  const isPlanned = analysis?.status === ProductionStatus.Planned;
  const isInProgress = analysis?.status === ProductionStatus.InProgress;
  const isCompleted = analysis?.status === ProductionStatus.Completed;
  const showResults = isInProgress || isCompleted;
  const fieldsDisabled = saving || isCompleted;

  usePageTitle(`Analyse d'olive ${analysis?.reference}`, "Analyse d'olive");

  useEffect(() => {
    if (!id) return;

    const analysisId = Number(id);
    if (Number.isNaN(analysisId) || analysisId <= 0) return;

    fetchAnalysis(analysisId);

    return () => {
      clear();
    };
  }, [id, fetchAnalysis, clear]);

  useEffect(() => {
    if (!analysis) return;

    setForm({
      reference: analysis.reference ?? "",
      sourceTypeId: analysis.sourceTypeId ?? 0,
      sourceReference: analysis.sourceReference ?? "",
      humidityPercentage: analysis.humidityPercentage ?? undefined,
      waterPercentage: analysis.waterPercentage ?? undefined,
      oilPercentage: analysis.oilPercentage ?? undefined,
      acidityPercentage: analysis.acidityPercentage ?? undefined,
      varietyId: analysis.varietyId ?? 0,
      plannedDate: analysis.plannedDate
        ? new Date(analysis.plannedDate).toISOString().split("T")[0]
        : "",
    });

    setErrors({});
  }, [analysis]);

  const validateForm = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    const isPercentageInvalid = (value?: number) =>
      value !== undefined && (value < 0 || value > 100);

    // Source et date ne sont qu'affichées ici : seuls les taux sont validés
    // (les analyses créées à la clôture d'une récolte n'ont pas de date).
    if (isPercentageInvalid(form.humidityPercentage))
      validationErrors.humidityPercentage =
        "L'humidité doit être comprise entre 0 et 100 %.";

    if (isPercentageInvalid(form.waterPercentage))
      validationErrors.waterPercentage =
        "Le pourcentage d'eau doit être compris entre 0 et 100 %.";

    if (isPercentageInvalid(form.oilPercentage))
      validationErrors.oilPercentage =
        "Le pourcentage d'huile doit être compris entre 0 et 100 %.";

    if (isPercentageInvalid(form.acidityPercentage))
      validationErrors.acidityPercentage =
        "L'acidité doit être comprise entre 0 et 100 %.";

    return validationErrors;
  }, [form]);

  const updateForm = useCallback(
    <K extends keyof OliveAnalysisForm>(field: K, value: OliveAnalysisForm[K]) => {
      if (isCompleted) return;

      setForm((previous) => ({ ...previous, [field]: value }));

      setErrors((previous) => {
        if (!previous[field]) return previous;

        const next = { ...previous };
        delete next[field];
        return next;
      });
    },
    [isCompleted],
  );

  const buildUpdateRequest = useCallback(
    (analysisId: number): UpdateOliveAnalysisParams => ({
      id: analysisId,
      humidityPercentage: form.humidityPercentage,
      waterPercentage: form.waterPercentage,
      oilPercentage: form.oilPercentage,
      acidityPercentage: form.acidityPercentage,
    }),
    [form],
  );

  const handleStart = useCallback(async () => {
    if (!analysis || !isPlanned || saving) return;

    try {
      await start(analysis.id);
      await fetchAnalysis(analysis.id);
      toast.success("L'analyse d'olive a été lancée avec succès.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible de lancer l'analyse d'olive.",
      );
    }
  }, [analysis, isPlanned, saving, start, fetchAnalysis]);

  const handleSubmit = useCallback(async () => {
    if (!analysis || isCompleted || !isInProgress || saving) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    try {
      await update(analysis.id, buildUpdateRequest(analysis.id));
      await fetchAnalysis(analysis.id);
      setErrors({});
      toast.success("Analyse d'olive modifiée avec succès.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de modifier l'analyse d'olive.";

      toast.error(message);
      setErrors({ general: message });
    }
  }, [
    analysis,
    isCompleted,
    isInProgress,
    saving,
    validateForm,
    buildUpdateRequest,
    update,
    fetchAnalysis,
  ]);

  const handleOpenCompleteDrawer = useCallback(() => {
    if (!analysis || !isInProgress || saving) return;

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

  const handleCloseCompleteDrawer = useCallback(() => {
    if (!saving) setCompleteDrawerOpen(false);
  }, [saving]);

  const handleComplete = useCallback(async () => {
    if (!analysis || !isInProgress || saving) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCompleteDrawerOpen(false);
      toast.error(
        "Veuillez corriger les erreurs du formulaire avant de clôturer.",
      );
      return;
    }

    try {
      // La clôture ne fait que changer le statut : les taux saisis sont
      // enregistrés d'abord, sinon ils seraient perdus.
      await update(analysis.id, buildUpdateRequest(analysis.id));
      await complete(analysis.id, { id: analysis.id });
      await fetchAnalysis(analysis.id);
      setCompleteDrawerOpen(false);
      setErrors({});
      toast.success("L'analyse d'olive a été clôturée avec succès.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de clôturer l'analyse d'olive.";

      toast.error(message);
      setErrors({ general: message });
    }
  }, [
    analysis,
    isInProgress,
    saving,
    validateForm,
    buildUpdateRequest,
    update,
    complete,
    fetchAnalysis,
  ]);


  const sourceTypeLabel = getSourceTypeLabel(form.sourceTypeId);
  const sourceReferenceLabel = getSourceReferenceLabel(form.sourceTypeId);
  const headerReference = analysis?.reference ? ` ${analysis.reference}` : "";
  const hasInvalidId = !id || Number.isNaN(Number(id)) || Number(id) <= 0;

  if (hasInvalidId) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Analyse d'olive{headerReference}</h1>
            <p className="page-description">Consultation de l'analyse.</p>
            {analysis && renderStatus(analysis.status, productionStatusConfig)}
          </div>
        </div>

        <div className="error-message">Identifiant de l'analyse invalide.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Analyse d'olive{headerReference}</h1>
            <p className="page-description">Consultation de l'analyse.</p>
            {analysis && renderStatus(analysis.status, productionStatusConfig)}
          </div>
        </div>

        <div className="loading">Chargement de l'analyse d'olive...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Analyse d'olive{headerReference}</h1>
            <p className="page-description">Consultation de l'analyse.</p>
            {analysis && renderStatus(analysis.status, productionStatusConfig)}
          </div>
        </div>

        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Analyse d'olive</h1>
            <p className="page-description">Consultation de l'analyse.</p>
          </div>
        </div>

        <div className="error-message">Analyse d'olive introuvable.</div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>{renderStatus(analysis.status, productionStatusConfig)}</div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {isPlanned && (
            <Button variant="primary" onClick={handleStart} disabled={saving}>
              {saving ? "Lancement..." : "Lancer l'analyse"}
            </Button>
          )}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleOpenCompleteDrawer}
              disabled={saving}
            >
              {saving ? "Clôture..." : "Clôturer l'analyse"}
            </Button>
          )}
        </div>
      </div>
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Informations générales</h3>
              <span>Informations relatives à l'analyse</span>
            </div>
          </div>

          <div className="info-grid">
            <InfoFieldWidget label="Type de source" value={sourceTypeLabel} />
            <InfoFieldWidget label={sourceReferenceLabel} value={form.sourceReference || "-"} />
            <InfoFieldWidget label="Variété" value={getOliveVarietyLabel(form.varietyId)} />
            <InfoFieldWidget
              label="Quantité d'olives"
              value={formatOliveQuantity(analysis?.quantityKg, analysis?.lotsCount)}
            />
            <InfoFieldWidget label="Date prévue" value={formatPlannedDate(form.plannedDate)} />
            <InfoFieldWidget label="Début" value={formatStringToDateTime(analysis?.startTime)} />
            <InfoFieldWidget label="Fin" value={formatStringToDateTime(analysis?.endTime)} />
            {/* Références des lots analysés, pour les retrouver dans le stock. */}
            <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
              <span className="filter-item-label">
                Lots d'olives{analysis?.lots?.length ? ` (${analysis.lots.length})` : ""}
              </span>

              {analysis?.lots?.length ? (
                <div className="lot-chips">
                  {analysis.lots.map((lot) => (
                    <span key={lot.id} className="lot-chip">
                      {lot.reference}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="filter-item-value">-</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {showResults && (
        <Card>
            <div className="filters-header">
              <div>
                <h3>Résultats de l'analyse</h3>
                <span>Résultats du contrôle physico-chimique des olives.</span>
              </div>
            </div>

            <div className="info-grid">
              <TextInput
                label="Humidité (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.humidityPercentage ?? ""}
                onChange={(event) =>
                  updateForm("humidityPercentage", toOptionalNumber(event.target.value))
                }
                disabled={fieldsDisabled}
              />
              {errors.humidityPercentage && (
                <span className="field-error">{errors.humidityPercentage}</span>
              )}

              <TextInput
                label="Eau (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.waterPercentage ?? ""}
                onChange={(event) =>
                  updateForm("waterPercentage", toOptionalNumber(event.target.value))
                }
                disabled={fieldsDisabled}
              />

              {errors.waterPercentage && (
                <span className="field-error">{errors.waterPercentage}</span>
              )}

              <TextInput
                label="Huile (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.oilPercentage ?? ""}
                onChange={(event) =>
                  updateForm("oilPercentage", toOptionalNumber(event.target.value))
                }
                disabled={fieldsDisabled}
              />

              {errors.oilPercentage && (
                <span className="field-error">{errors.oilPercentage}</span>
              )}

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
        </Card>
      )}

      {errors.general && (
        <div className="field-error" style={{ marginTop: "15px" }}>
          {errors.general}
        </div>
      )}

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

      <CompleteOliveAnalysisDrawer
        open={completeDrawerOpen}
        saving={saving}
        reference={analysis.reference}
        sourceTypeLabel={sourceTypeLabel}
        sourceReferenceLabel={sourceReferenceLabel}
        sourceReferenceValue={form.sourceReference}
        varietyLabel={getOliveVarietyLabel(form.varietyId)}
        plannedDateLabel={formatPlannedDate(form.plannedDate)}
        humidityPercentage={form.humidityPercentage}
        waterPercentage={form.waterPercentage}
        oilPercentage={form.oilPercentage}
        acidityPercentage={form.acidityPercentage}
        onClose={handleCloseCompleteDrawer}
        onConfirm={handleComplete}
      />
    </div>
  );
}