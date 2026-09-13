import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import Select from "../../../../common/widgets/select/Select";

import { useConstantsStore } from "../../../appConstants/ConstantsStore";
import type { SourceOption } from "../widgets/SourceReference";
import type {
  InputSourceType,
  PressingOperationInput,
} from "../widgets/InputTypes";
import NewPressingOperationInputsWidget from "../widgets/NewPressingOperationInputsWidget";
import { useCreatePressingOperation } from "../hooks/UseCreatePressingOperation";
import type { CreatePressingOperationParams } from "../../domain/params/CreatePressingOperationParams";
import ProductionStatusSelector from "../../../../common/widgets/ProductionStatusSelector";

type NewPressingOperationForm = {
  pressingDate: string;
  statusId: number;
  notes: string;
  inputs: PressingOperationInput[];
};

const initialForm: NewPressingOperationForm = {
  pressingDate: new Date().toISOString().split("T")[0],
  statusId: 0,
  notes: "",
  inputs: [],
};

export default function NewPressingOperationPage() {
  const navigate = useNavigate();
  const { createPressingOperationAction, error } = useCreatePressingOperation();
  const { Appconstants, loading: constantsLoading } = useConstantsStore();

  const [form, setForm] = useState<NewPressingOperationForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const statusOptions = Appconstants.productionStatus.map((status) => ({
    value: status.id.toString(),
    label: status.label,
  }));

  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    if (!form.pressingDate) {
      validationErrors.pressingDate = "La date de pression est obligatoire.";
    }

    if (!form.statusId) {
      validationErrors.statusId = "Le statut est obligatoire.";
    }

    if (form.inputs.length === 0) {
      validationErrors.inputs = "Ajoutez au moins une source d’olives.";
    }

    form.inputs.forEach((input) => {
      if (input.sourceType === "harvest") {
        if (!input.harvestId) {
          validationErrors[`input-${input.id}`] =
            "Sélectionnez une récolte valide.";
        }
      } else if (!input.purchaseItemId) {
        validationErrors[`input-${input.id}`] = "Sélectionnez un achat valide.";
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
      purchaseItemId: null,
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
                purchaseItemId: null,
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
            purchaseItemId: null,
            reference: source.reference,
          };
        }

        return {
          ...input,
          harvestId: null,
          purchaseItemId: source.id,
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
        createdAt: new Date(`${form.pressingDate}T00:00:00`).toISOString(),
        status: form.statusId,
        notes: form.notes || null,
        startTime: null,
        endTime: null,
        oliveQuantityKg: form.inputs.reduce(
          (total, input) => total + Number(input.quantityKg || 0),
          0,
        ),
        oilQuantityLiters: null,
        inputs: form.inputs.map((input) => ({
          harvestId: input.sourceType === "harvest" ? input.harvestId : null,
          purchaseItemId:
            input.sourceType === "purchase" ? input.purchaseItemId : null,
          quantityKg: Number(input.quantityKg),
        })),
      };

      const success = await createPressingOperationAction(request);

      if (success) {
        toast.success("Opération créée avec succès.");
        navigate("/production");
        return;
      }

      toast.error(error ?? "Impossible de créer l’opération de pression.");
    } catch {
      toast.error(
        "Une erreur est survenue lors de la création de l’opération.",
      );
      setErrors({ general: "Impossible de créer l’opération de pression." });
    } finally {
      setSaving(false);
    }
  }, [
    form,
    getValidationErrors,
    createPressingOperationAction,
    error,
    navigate,
  ]);

  const handleCancel = useCallback(() => {
    if (!saving) navigate("/production");
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Nouvelle opération de pression</h1>
          <p className="page-description">
            Créer une nouvelle opération de pression et définir les olives
            utilisées.
          </p>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à l'opération de pression</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput
              label="Date de pression"
              type="date"
              value={form.pressingDate}
              onChange={(event) =>
                updateForm("pressingDate", event.target.value)
              }
            />
            {errors.pressingDate && (
              <span className="field-error">{errors.pressingDate}</span>
            )}
          </div>

          <div className="filter-item">
            <ProductionStatusSelector
            label="Statut"
              value={form.statusId || null}
              onChange={(statusId) => updateForm("statusId", statusId ?? 0)}
            />
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

      <div className="filters-footer">
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
