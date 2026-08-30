import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "../../../../../common/widgets/select/Select";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import Button from "../../../../../common/widgets/button/Button";
import type { CreateOliveAnalysisParams } from "../../domain/params/CreateOliveAnalysisParams";
import { useCreateOliveAnalysis } from "../hooks/useCreateOliveAnalysis";

type NewOliveAnalysisForm = {
  sourceTypeId: number;
  sourceId: number;
  humidityPercentage: number;
  waterPercentage: number;
  oilPercentage: number;
  acidityPercentage: number;
  analysisDate: string;
};

const initialForm: NewOliveAnalysisForm = {
  sourceTypeId: 0,
  sourceId: 0,
  humidityPercentage: 0,
  waterPercentage: 0,
  oilPercentage: 0,
  acidityPercentage: 0,
  analysisDate: new Date().toISOString().split("T")[0],
};

export default function NewOliveAnalysisPage() {
  const navigate = useNavigate();

  const { createOliveAnalysisAction, error } = useCreateOliveAnalysis();

  const [form, setForm] = useState<NewOliveAnalysisForm>(initialForm);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  /*
   * Types de sources.
   *
   * À adapter si les IDs de tes constantes
   * sont différents dans ton application.
   */
  const sourceTypeOptions = useMemo(
    () => [
      {
        value: "0",
        label: "Sélectionnez un type de source",
      },
      {
        value: "1",
        label: "Récolte",
      },
      {
        value: "2",
        label: "Achat d'olives",
      },
    ],
    [],
  );

  /*
   * Validation du formulaire
   */
  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    if (!form.sourceTypeId) {
      validationErrors.sourceTypeId = "Le type de source est obligatoire.";
    }

    if (!form.sourceId || form.sourceId <= 0) {
      validationErrors.sourceId = "La source est obligatoire.";
    }

    if (!form.analysisDate) {
      validationErrors.analysisDate = "La date d’analyse est obligatoire.";
    }

    if (form.humidityPercentage < 0 || form.humidityPercentage > 100) {
      validationErrors.humidityPercentage =
        "L'humidité doit être comprise entre 0 et 100 %.";
    }

    if (form.waterPercentage < 0 || form.waterPercentage > 100) {
      validationErrors.waterPercentage =
        "Le pourcentage d'eau doit être compris entre 0 et 100 %.";
    }

    if (form.oilPercentage < 0 || form.oilPercentage > 100) {
      validationErrors.oilPercentage =
        "Le pourcentage d'huile doit être compris entre 0 et 100 %.";
    }

    if (form.acidityPercentage < 0 || form.acidityPercentage > 100) {
      validationErrors.acidityPercentage =
        "L'acidité doit être comprise entre 0 et 100 %.";
    }

    return validationErrors;
  }, [form]);

  const isFormValid = useMemo(
    () => Object.keys(getValidationErrors()).length === 0,
    [getValidationErrors],
  );

  /*
   * Mise à jour du formulaire
   */
  const updateForm = useCallback(
    <K extends keyof NewOliveAnalysisForm>(
      field: K,
      value: NewOliveAnalysisForm[K],
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setErrors((previous) => {
        if (!previous[field]) {
          return previous;
        }

        const next = {
          ...previous,
        };

        delete next[field];

        return next;
      });
    },
    [],
  );

  /*
   * Création de l'analyse
   */
  const handleSubmit = useCallback(async () => {
    const validationErrors = getValidationErrors();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error("Veuillez corriger les erreurs du formulaire.");

      return;
    }

    try {
      setSaving(true);

      const request: CreateOliveAnalysisParams = {
        sourceTypeId: form.sourceTypeId,
        sourceId: form.sourceId,
      };

      const success = await createOliveAnalysisAction(request);

      if (success) {
        toast.success("Analyse d'olive créée avec succès.");

        navigate("/Olive-analyses");

        return;
      }

      toast.error(error ?? "Impossible de créer l'analyse d'olive.");
    } catch {
      toast.error("Une erreur est survenue lors de la création de l'analyse.");

      setErrors({
        general: "Impossible de créer l'analyse d'olive.",
      });
    } finally {
      setSaving(false);
    }
  }, [form, getValidationErrors, createOliveAnalysisAction, error, navigate]);

  /*
   * Annulation
   */
  const handleCancel = useCallback(() => {
    if (!saving) {
      navigate("/Olive-analyses");
    }
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      {/* =========================
          HEADER
      ========================== */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Nouvelle analyse d'olive</h1>

          <p className="page-description">
            Créer une nouvelle analyse d'olive et renseigner les résultats de
            contrôle.
          </p>
        </div>
      </div>

      {/* =========================
          SOURCE
      ========================== */}
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Source de l'analyse</h3>

            <span>
              Sélectionnez la source sur laquelle l'analyse a été réalisée.
            </span>
          </div>
        </div>

        <div className="filters-content">
          {/* TYPE SOURCE */}
          <div className="filter-item">
            <Select
              label="Type de source"
              value={String(form.sourceTypeId)}
              onChange={(event) =>
                updateForm("sourceTypeId", Number(event.target.value))
              }
              options={sourceTypeOptions}
            />

            {errors.sourceTypeId && (
              <span className="field-error">{errors.sourceTypeId}</span>
            )}
          </div>

          {/* SOURCE ID */}
          <div className="filter-item">
            <TextInput
              label={
                form.sourceTypeId === 1
                  ? "ID de la récolte"
                  : form.sourceTypeId === 2
                    ? "ID de l'achat"
                    : "ID de la source"
              }
              placeholder={
                form.sourceTypeId === 1
                  ? "Ex : 123"
                  : form.sourceTypeId === 2
                    ? "Ex : 456"
                    : "ID source"
              }
              type="number"
              min="1"
              value={form.sourceId || ""}
              onChange={(event) =>
                updateForm(
                  "sourceId",
                  event.target.value ? Number(event.target.value) : 0,
                )
              }
            />

            {errors.sourceId && (
              <span className="field-error">{errors.sourceId}</span>
            )}
          </div>

          {/* DATE */}
          <div className="filter-item">
            <TextInput
              label="Date d'analyse"
              type="date"
              value={form.analysisDate}
              onChange={(event) =>
                updateForm("analysisDate", event.target.value)
              }
            />

            {errors.analysisDate && (
              <span className="field-error">{errors.analysisDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          ERREUR GENERALE
      ========================== */}
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

      {/* =========================
          ACTIONS
      ========================== */}
      <div className="filters-footer">
        <Button variant="secondary" onClick={handleCancel} disabled={saving}>
          Annuler
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving || !isFormValid}
        >
          {saving ? "Création..." : "Créer l'analyse"}
        </Button>
      </div>
    </div>
  );
}
