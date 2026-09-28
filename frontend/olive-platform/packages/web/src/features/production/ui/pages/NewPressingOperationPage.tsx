import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";

import { useConstantsStore } from "../../../../stores/ConstantsStore";
import type { SourceOption } from "../widgets/SourceReference";
import type {
  InputSourceType,
  PressingOperationInput,
} from "../widgets/InputTypes";
import NewPressingOperationInputsWidget from "../widgets/NewPressingOperationInputsWidget";
import { CreatePressingOperation } from "@olive-platform/core/features/production/domain/useCases/CreatePressingOperation";
import type { CreatePressingOperationParams } from "@olive-platform/core/features/production/domain/params/CreatePressingOperationParams";
import type { CreatePressingOperationInputParams } from "@olive-platform/core/features/production/domain/params/CreatePressingOperationInputParams";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import Card from "../../../../common/widgets/card/Card";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";

type NewPressingOperationForm = {
  plannedDate: string;
  notes: string;
  inputs: PressingOperationInput[];
};

const initialForm: NewPressingOperationForm = {
  plannedDate: new Date().toISOString().split("T")[0],
  notes: "",
  inputs: [],
};

export default function NewPressingOperationPage() {
  const navigate = useNavigate();
  const { loading: constantsLoading } = useConstantsStore();

  const [form, setForm] = useState<NewPressingOperationForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  usePageTitle(
    "Nouvelle opération de pression",
    "Créer une nouvelle opération de pression et définir les olives utilisées",
  );

  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    if (!form.plannedDate) {
      validationErrors.plannedDate = "La date de pression est obligatoire.";
    }

    if (form.inputs.length === 0) {
      validationErrors.inputs = "Ajoutez au moins une source d’olives.";
    }

    form.inputs.forEach((input) => {
      const isHarvest = input.sourceType === "harvest";

      if (isHarvest ? !input.harvestId : !input.purchaseId) {
        validationErrors[`input-${input.id}`] = isHarvest
          ? "Sélectionnez une récolte valide."
          : "Sélectionnez un achat valide.";
      } else if (!input.lots?.length) {
        validationErrors[`input-${input.id}`] =
          "Sélectionnez au moins un lot disponible.";
      }

      if (!input.quantityKg || Number(input.quantityKg) <= 0) {
        validationErrors[`quantity-${input.id}`] =
          "La quantité doit être supérieure à 0.";
      }
    });

    return validationErrors;
  }, [form]);

  const isFormValid = useMemo(
    () => Object.keys(getValidationErrors()).length === 0,
    [getValidationErrors],
  );

  const updateForm = useCallback(
    <K extends keyof NewPressingOperationForm>(
      field: K,
      value: NewPressingOperationForm[K],
    ) => {
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

  const addInput = useCallback(() => {
    const newInput: PressingOperationInput = {
      id: crypto.randomUUID(),
      sourceType: "harvest",
      harvestId: null,
      purchaseId: null,
      reference: "",
      quantityKg: "",
      notes: "",
    };

    setForm((previous) => ({
      ...previous,
      inputs: [...previous.inputs, newInput],
    }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next.inputs;
      return next;
    });
  }, []);

  const removeInput = useCallback((id: string) => {
    setForm((previous) => ({
      ...previous,
      inputs: previous.inputs.filter((input) => input.id !== id),
    }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next[`input-${id}`];
      delete next[`quantity-${id}`];
      return next;
    });
  }, []);

  const updateInput = useCallback(
    (
      id: string,
      field: keyof PressingOperationInput,
      value: string | number | null,
    ) => {
      setForm((previous) => ({
        ...previous,
        inputs: previous.inputs.map((input) =>
          input.id === id ? { ...input, [field]: value } : input,
        ),
      }));

      setErrors((previous) => {
        const next = { ...previous };
        if (field === "reference") delete next[`input-${id}`];
        if (field === "quantityKg") delete next[`quantity-${id}`];
        return next;
      });
    },
    [],
  );

  const changeInputSource = useCallback(
    (id: string, sourceType: InputSourceType) => {
      setForm((previous) => ({
        ...previous,
        inputs: previous.inputs.map((input) =>
          input.id === id
            ? {
                ...input,
                sourceType,
                harvestId: null,
                lots: [],
                purchaseId: null,
                reference: "",
                quantityKg: "",
              }
            : input,
        ),
      }));

      setErrors((previous) => {
        const next = { ...previous };
        delete next[`input-${id}`];
        delete next[`quantity-${id}`];
        return next;
      });
    },
    [],
  );

  const handleSelectSource = useCallback((id: string, source: SourceOption) => {
    setForm((previous) => ({
      ...previous,
      inputs: previous.inputs.map((input) => {
        if (input.id !== id) return input;

        if (input.sourceType === "harvest") {
          return {
            ...input,
            harvestId: source.id,
            lots: source.lots ?? [],
            purchaseId: null,
            reference: source.reference,
          };
        }

        return {
          ...input,
          harvestId: null,
          purchaseId: source.id,
          lots: source.lots ?? [],
          reference: source.reference,
        };
      }),
    }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next[`input-${id}`];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = getValidationErrors();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    try {
      setSaving(true);

      const request: CreatePressingOperationParams = {
        plannedDate: new Date(`${form.plannedDate}T00:00:00`).toISOString(),
        // Une nouvelle opération est toujours planifiée.
        status: ProductionStatus.Planned,
        notes: form.notes || null,
        startTime: null,
        endTime: null,
        oliveQuantityKg: form.inputs.reduce(
          (total, input) => total + Number(input.quantityKg || 0),
          0,
        ),
        oilQuantityLiters: null,
        // Une entrée par lot coché : la pression réserve exactement ces lots.
        inputs: form.inputs.flatMap<CreatePressingOperationInputParams>((input) =>
          (input.lots ?? []).map((lot) => ({
            lotId: lot.id,
            quantityKg: lot.quantityKg,
          })),
        ),
      };

      // Appel direct : une erreur de l'API remonte avec son message.
      await CreatePressingOperation(request);

      toast.success("Opération créée avec succès.");
      navigate("/production");
    } catch (e: any) {
      const message =
        e?.message ?? "Impossible de créer l’opération de pression.";
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setSaving(false);
    }
  }, [form, getValidationErrors, navigate]);

  const handleCancel = useCallback(() => {
    if (!saving) navigate("/production");
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à l'opération de pression</span>
          </div>
        </div>

        {/* Même grille que les autres formulaires */}
        <Card>
          <div className="info-grid">
            <div className="filter-item">
              <TextInput
                label="Date de pression"
                type="date"
                value={form.plannedDate}
                onChange={(event) =>
                  updateForm("plannedDate", event.target.value)
                }
              />
              {errors.plannedDate && (
                <span className="field-error">{errors.plannedDate}</span>
              )}
            </div>

            <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
              <label>Notes</label>
              <TextEditor
                value={form.notes}
                placeholder="Notes concernant l'opération..."
                onChange={(value) => updateForm("notes", value)}
              />
            </div>
          </div>
        </Card>
      </div>

      <NewPressingOperationInputsWidget
        inputs={form.inputs}
        errors={errors}
        onAdd={addInput}
        onRemove={removeInput}
        onUpdate={updateInput}
        onChangeSource={changeInputSource}
        onSelectSource={handleSelectSource}
      />

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
          disabled={saving || constantsLoading || !isFormValid}
        >
          {saving ? "Création..." : "Créer la pression"}
        </Button>
      </div>
    </div>
  );
}
