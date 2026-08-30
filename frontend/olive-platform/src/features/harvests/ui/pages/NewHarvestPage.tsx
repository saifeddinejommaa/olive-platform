import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import Select from "../../../../common/widgets/select/Select";

import { useCreateHarvest } from "../hooks/UseCreateHarvest";
import type { CreateHarvestParams } from "../../domain/params/CreateHarvestParams";
import { usePlotsAutocomplete } from "../../../plots/ui/hooks/UsePlotsAutocomplete";
import { useConstantsStore } from "../../../appConstants/ConstantsStore";
import { useAvailableTrees } from "../../../plots/ui/hooks/UseAvailableTrees";
import { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

type NewHarvestForm = {
  plotId: number;
  varietyId: number;
  plannedTrees: number;
  harvestDate: string;
  notes: string;
};

const initialForm: NewHarvestForm = {
  plotId: 0,
  varietyId: 0,
  plannedTrees: 0,
  harvestDate: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function NewHarvestPage() {
  const navigate = useNavigate();
  const { createHarvestAction, error } = useCreateHarvest();
  const [form, setForm] = useState<NewHarvestForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { Appconstants, loading: constantsLoading } = useConstantsStore();

  const {
    availableTrees,
    loading: availableTreesLoading,
    error: availableTreesError,
  } = useAvailableTrees(form.plotId, form.varietyId);

  const varietyOptions = useMemo(
    () =>
      Appconstants.oliveVarieties.map((variety) => ({
        value: String(variety.id),
        label: variety.label,
      })),
    [Appconstants.oliveVarieties],
  );

  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    if (!form.plotId) validationErrors.plotId = "La parcelle est obligatoire.";
    if (!form.varietyId)
      validationErrors.varietyId = "La variété est obligatoire.";
    if (!form.harvestDate)
      validationErrors.harvestDate = "La date de récolte est obligatoire.";
    if (form.plannedTrees <= 0)
      validationErrors.harvestedTrees =
        "Le nombre d'arbres doit être supérieur à 0.";
    if (availableTrees !== null && form.plannedTrees > availableTrees) {
      validationErrors.harvestedTrees = `Le nombre d'arbres ne peut pas dépasser ${availableTrees}.`;
    }
    return validationErrors;
  }, [form, availableTrees]);

  const isFormValid = useMemo(
    () => Object.keys(getValidationErrors()).length === 0,
    [getValidationErrors],
  );

  const updateForm = useCallback(
    <K extends keyof NewHarvestForm>(field: K, value: NewHarvestForm[K]) => {
      setForm((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => {
        if (!previous[field]) return previous;
        const next = { ...previous };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    const validationErrors = getValidationErrors();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    try {
      setSaving(true);
      const request: CreateHarvestParams = {
        plotId: form.plotId,
        varietyId: form.varietyId,
        plannedTrees: form.plannedTrees,
        status: ProductionStatus.Planned,
        harvestDate: form.harvestDate,
        notes: form.notes || null,
      };

      const success = await createHarvestAction(request);

      if (success) {
        toast.success("Récolte créée avec succès.");
        navigate("/production");
        return;
      }

      toast.error(error ?? "Impossible de créer la récolte.");
    } catch {
      toast.error("Une erreur est survenue lors de la création de la récolte.");
      setErrors({ general: "Impossible de créer la récolte." });
    } finally {
      setSaving(false);
    }
  }, [form, getValidationErrors, createHarvestAction, error, navigate]);

  const handleCancel = useCallback(() => {
    if (!saving) navigate("/production");
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Nouvelle récolte</h1>
          <p className="page-description">
            Créer une nouvelle récolte et renseigner les informations associées.
          </p>
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
            <label>Parcelle</label>
            <div style={{ width: "100%", minWidth: 0 }}>
              <Autocomplete
                useSearch={usePlotsAutocomplete}
                getLabel={(plot) => `${plot.reference} - ${plot.name}`}
                onSelect={(plot) => updateForm("plotId", plot.id)}
                placeholder="Rechercher une parcelle..."
                width="100%"
              />
            </div>
            {errors.plotId && (
              <span className="field-error">{errors.plotId}</span>
            )}
          </div>

          <div className="filter-item">
            <Select
              label="Variété"
              value={String(form.varietyId)}
              onChange={(event) =>
                updateForm("varietyId", Number(event.target.value))
              }
              options={[
                { value: "0", label: "Sélectionnez une variété" },
                ...varietyOptions,
              ]}
              disabled={constantsLoading}
            />
            {errors.varietyId && (
              <span className="field-error">{errors.varietyId}</span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Date de récolte"
              type="date"
              value={form.harvestDate}
              onChange={(event) =>
                updateForm("harvestDate", event.target.value)
              }
            />
            {errors.harvestDate && (
              <span className="field-error">{errors.harvestDate}</span>
            )}
          </div>

          {form.plotId > 0 && form.varietyId > 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: "10px",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
              }}
            >
              <div className="available-trees-info">
                {availableTreesLoading && (
                  <span>Calcul du nombre d'arbres disponibles...</span>
                )}
                {!availableTreesLoading && availableTrees !== null && (
                  <strong>
                    {availableTrees.toLocaleString("fr-FR")} arbres disponibles
                    pour la récolte
                  </strong>
                )}
                {availableTreesError && (
                  <span className="field-error">{availableTreesError}</span>
                )}
              </div>
            </div>
          )}

          <div className="filter-item">
            <TextInput
              label="Nombre d'arbres à récolter"
              type="number"
              min="0"
              max={availableTrees ?? undefined}
              value={form.plannedTrees || ""}
              onChange={(event) =>
                updateForm("plannedTrees", Number(event.target.value))
              }
            />
            {errors.harvestedTrees && (
              <span className="field-error">{errors.harvestedTrees}</span>
            )}
          </div>

          <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <TextEditor
              value={form.notes}
              placeholder="Notes concernant la récolte..."
              onChange={(value) => updateForm("notes", value)}
            />
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="field-error" style={{ marginTop: "15px" }}>
          {errors.general}
        </div>
      )}

      <div className="filters-footer">
        <Button variant="secondary" onClick={handleCancel} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving || !isFormValid}
        >
          {saving ? "Création..." : "Créer la récolte"}
        </Button>
      </div>
    </div>
  );
}
