import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";

import type { CreateHarvestParams } from "@olive-platform/core/features/harvests/domain/params/CreateHarvestParams";
import { createHarvestUseCase } from "@olive-platform/core/features/harvests/domain/usecases/createHarvest";
import type { PlotForList } from "@olive-platform/core/features/plots/domain/entities/PlotForList";
import type { PlotVarietyDetail } from "@olive-platform/core/features/plots/domain/entities/PlotVarietyDetail";
import { GetPlotDetails } from "@olive-platform/core/features/plots/domain/usecases/GetPlotsDetails";
import { getTodayDate } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { usePlotsAutocomplete } from "../../../plots/ui/hooks/UsePlotsAutocomplete";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import Card from "../../../../common/widgets/card/Card";
import HarvestTypeSelector from "../../../../common/widgets/HarvestTypeSelector";
import { useSeasonStore } from "../../../../stores/SeasonStore";

// Valeur par défaut acceptée par l'API (1 = Manuelle).
const DEFAULT_HARVEST_TYPE = 1;

type NewHarvestForm = {
  plotId: number;
  varietyId: number;
  plannedTrees: number;
  plannedDate: string;
  harvestType: number;
  notes: string;
};

// Aujourd'hui s'il est dans la campagne sélectionnée, sinon son premier jour.
function defaultDateInSeason(season?: { startDate: string; endDate: string }) {
  const today = getTodayDate();

  if (!season || (today >= season.startDate && today <= season.endDate)) {
    return today;
  }

  return season.startDate;
}

export default function NewHarvestPage() {
  const navigate = useNavigate();

  const selectedSeason = useSeasonStore((state) =>
    state.seasons.find((season) => season.id === state.selectedSeasonId),
  );

  const [form, setForm] = useState<NewHarvestForm>(() => ({
    plotId: 0,
    varietyId: 0,
    plannedTrees: 0,
    harvestType: DEFAULT_HARVEST_TYPE,
    plannedDate: defaultDateInSeason(selectedSeason),
    notes: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Variétés de la parcelle choisie, avec les arbres restant à récolter.
  const [varieties, setVarieties] = useState<PlotVarietyDetail[]>([]);
  const [varietiesLoading, setVarietiesLoading] = useState(false);
  const [varietiesError, setVarietiesError] = useState<string | null>(null);

  const selectedVariety = varieties.find(
    (variety) => variety.varietyId === form.varietyId,
  );
  const availableTrees = selectedVariety?.remainingTreesToHarvest ?? null;

  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    if (!form.plotId) validationErrors.plotId = "La parcelle est obligatoire.";
    if (!form.varietyId)
      validationErrors.varietyId = "La variété est obligatoire.";
    if (!form.plannedDate)
      validationErrors.plannedDate = "La date de récolte est obligatoire.";
    if (!form.harvestType)
      validationErrors.harvestType = "Le type de récolte est obligatoire.";
    if (form.plannedTrees <= 0)
      validationErrors.plannedTrees =
        "Le nombre d'arbres doit être supérieur à 0.";
    if (availableTrees !== null && form.plannedTrees > availableTrees) {
      validationErrors.plannedTrees = `Le nombre d'arbres ne peut pas dépasser ${availableTrees}.`;
    }
    return validationErrors;
  }, [form, availableTrees]);

  usePageTitle("Nouvelle récolte","Créer une nouvelle récolte et renseigner les informations associées.");
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

  const selectVariety = useCallback((variety: PlotVarietyDetail) => {
    setForm((previous) => ({
      ...previous,
      varietyId: variety.varietyId,
      // Proposé par défaut : tous les arbres restant à récolter.
      plannedTrees: variety.remainingTreesToHarvest,
    }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next.varietyId;
      delete next.plannedTrees;
      return next;
    });
  }, []);

  // Le choix de la parcelle charge ses variétés.
  const handlePlotSelect = useCallback(
    async (plot: PlotForList) => {
      setForm((previous) => ({
        ...previous,
        plotId: plot.id,
        varietyId: 0,
        plannedTrees: 0,
      }));
      setErrors((previous) => {
        const next = { ...previous };
        delete next.plotId;
        return next;
      });
      setVarieties([]);
      setVarietiesError(null);
      setVarietiesLoading(true);

      try {
        const details = await GetPlotDetails(plot.id);
        const plotVarieties = details.varieties ?? [];

        setVarieties(plotVarieties);

        // Une seule variété récoltable : on la présélectionne.
        const harvestable = plotVarieties.filter(
          (variety) => variety.remainingTreesToHarvest > 0,
        );

        if (harvestable.length === 1) {
          selectVariety(harvestable[0]);
        }
      } catch {
        setVarietiesError("Impossible de charger les variétés de la parcelle.");
      } finally {
        setVarietiesLoading(false);
      }
    },
    [selectVariety],
  );

  // Ouverture depuis la liste des parcelles (« Lancer une récolte ») :
  // la parcelle est présélectionnée et ses variétés chargées.
  const [searchParams] = useSearchParams();
  const initialPlotId = Number(searchParams.get("plotId")) || null;
  const [initialPlotLabel, setInitialPlotLabel] = useState<string | undefined>();

  useEffect(() => {
    if (!initialPlotId) return;

    let cancelled = false;

    GetPlotDetails(initialPlotId)
      .then((plot) => {
        if (cancelled) return;
        setInitialPlotLabel(`${plot.reference} - ${plot.name}`);
        handlePlotSelect({ id: initialPlotId } as PlotForList);
      })
      .catch(() => {
        if (!cancelled) toast.error("Impossible de charger la parcelle sélectionnée.");
      });

    return () => {
      cancelled = true;
    };
  }, [initialPlotId, handlePlotSelect]);

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
        plannedDate: form.plannedDate,
        notes: form.notes || null,
        harvestType: form.harvestType,
      };

      await createHarvestUseCase(request);

      toast.success("Récolte créée avec succès.");
      navigate("/harvests");
    } catch (e: any) {
      const message = e?.message ?? "Impossible de créer la récolte.";
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setSaving(false);
    }
  }, [form, getValidationErrors, navigate]);

  const handleCancel = useCallback(() => {
    if (!saving) navigate("/harvests");
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à la récolte</span>
          </div>
        </div>

        <Card>
        <div className="info-grid">
          <div className="filter-item">
            <label>Parcelle</label>
            <div style={{ width: "100%", minWidth: 0 }}>
              <Autocomplete
                // Remonté quand la parcelle présélectionnée est connue.
                key={initialPlotLabel ?? "plot"}
                defaultLabel={initialPlotLabel}
                useSearch={usePlotsAutocomplete}
                getLabel={(plot) => `${plot.reference} - ${plot.name}`}
                onSelect={handlePlotSelect}
                placeholder="Rechercher une parcelle..."
                width="100%"
              />
            </div>
            {errors.plotId && (
              <span className="field-error">{errors.plotId}</span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Date de récolte"
              type="date"
              value={form.plannedDate}
              min={selectedSeason?.startDate}
              max={selectedSeason?.endDate}
              onChange={(event) =>
                updateForm("plannedDate", event.target.value)
              }
            />
            {errors.plannedDate && (
              <span className="field-error">{errors.plannedDate}</span>
            )}
          </div>

          <div className="filter-item">
             <label>Type de Récolte</label>
            <HarvestTypeSelector
              value={form.harvestType}
              onChange={(value) =>
                updateForm("harvestType", value ?? 0)
              }
            />
            {errors.harvestType && (
              <span className="field-error">{errors.harvestType}</span>
            )}
          </div>

          {/* Variétés de la parcelle sélectionnée */}
          <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
            <label>Variété</label>

            {!form.plotId && (
              <span className="variety-options-hint">
                Sélectionnez d'abord une parcelle pour choisir la variété.
              </span>
            )}

            {form.plotId > 0 && varietiesLoading && (
              <span className="variety-options-hint">
                Chargement des variétés de la parcelle...
              </span>
            )}

            {form.plotId > 0 && varietiesError && (
              <span className="field-error">{varietiesError}</span>
            )}

            {form.plotId > 0 &&
              !varietiesLoading &&
              !varietiesError &&
              varieties.length === 0 && (
                <span className="variety-options-hint">
                  Aucune variété enregistrée pour cette parcelle.
                </span>
              )}

            {varieties.length > 0 && (
              <div className="variety-options">
                {varieties.map((variety) => {
                  const selected = variety.varietyId === form.varietyId;
                  const exhausted = variety.remainingTreesToHarvest <= 0;

                  return (
                    <button
                      key={variety.varietyId}
                      type="button"
                      disabled={exhausted}
                      onClick={() => selectVariety(variety)}
                      className={[
                        "variety-option",
                        selected ? "variety-option--selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <strong>{variety.varietyLabel}</strong>
                      <span>
                        {exhausted
                          ? "Tous les arbres sont récoltés"
                          : `${variety.remainingTreesToHarvest.toLocaleString("fr-FR")} / ${variety.numberOfTrees.toLocaleString("fr-FR")} arbres disponibles`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {errors.varietyId && (
              <span className="field-error">{errors.varietyId}</span>
            )}
          </div>

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
            {availableTrees !== null && !errors.plannedTrees && (
              <span className="variety-options-hint">
                {availableTrees.toLocaleString("fr-FR")} arbres disponibles
                pour la récolte
              </span>
            )}
            {errors.plannedTrees && (
              <span className="field-error">{errors.plannedTrees}</span>
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
        </Card>
      </div>

      {errors.general && (
        <div className="field-error" style={{ marginTop: "15px" }}>
          {errors.general}
        </div>
      )}

      {/* Barre d'actions fixée en bas de l'écran */}
      <div className="fixed-actions-spacer" />

      <div className="fixed-actions-bar">
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
