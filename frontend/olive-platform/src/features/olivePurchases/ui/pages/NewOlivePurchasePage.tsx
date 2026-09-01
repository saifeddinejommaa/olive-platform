import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import Select from "../../../../common/widgets/select/Select";

import { useConstantsStore } from "../../../appConstants/ConstantsStore";
import { useCreateOlivePurchase } from "../hooks/UseCreateOlivePurchase";
import type { CreateOlivePurchaseParams } from "../../domain/params/CreateOlivePurchaseParams";
import NewOlivePurchaseItemsWidget, {
  type OlivePurchaseItemForm,
} from "../widgets/NewOlivePurchaseItemsWidget";

type NewOlivePurchaseForm = {
  supplierName: string;
  purchaseDate: string;
  statusId: number;
  notes: string;
  items: OlivePurchaseItemForm[];
};

const initialForm: NewOlivePurchaseForm = {
  supplierName: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  statusId: 0,
  notes: "",
  items: [],
};

export default function NewOlivePurchasePage() {
  const navigate = useNavigate();
  const { createOlivePurchaseAction, error } = useCreateOlivePurchase();
  const { Appconstants, loading: constantsLoading } = useConstantsStore();

  const [form, setForm] = useState<NewOlivePurchaseForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const statusOptions = Appconstants.purchaseStatus.map((status) => ({
    value: status.id.toString(),
    label: status.label,
  }));

  

  const varietyOptions = Appconstants.oliveVarieties.map((variety) => ({
    value: variety.id.toString(),
    label: variety.label,
  }));

  const totalQuantityKg = useMemo(
    () =>
      form.items.reduce(
        (total, item) => total + Number(item.agreedQuantityKg || 0),
        0,
      ),
    [form.items],
  );

  const totalPrice = useMemo(
    () =>
      form.items.reduce(
        (total, item) =>
          total +
          Number(item.agreedQuantityKg || 0) *
            Number(item.pricePerKg || 0),
        0,
      ),
    [form.items],
  );

  const pricePerKg = useMemo(
    () => (totalQuantityKg > 0 ? totalPrice / totalQuantityKg : 0),
    [totalQuantityKg, totalPrice],
  );

  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    if (!form.supplierName.trim()) {
      validationErrors.supplierName = "Le fournisseur est obligatoire.";
    }

    if (!form.purchaseDate) {
      validationErrors.purchaseDate = "La date d'achat est obligatoire.";
    }

    if (!form.statusId) {
      validationErrors.statusId = "Le statut est obligatoire.";
    }

    if (form.items.length === 0) {
      validationErrors.items = "Ajoutez au moins une ligne d'achat.";
    }

    form.items.forEach((item) => {
      if (!item.varietyId) {
        validationErrors[`variety-${item.id}`] =
          "Sélectionnez une variété.";
      }

      if (
        !item.agreedQuantityKg ||
        Number(item.agreedQuantityKg) <= 0
      ) {
        validationErrors[`quantity-${item.id}`] =
          "La quantité doit être supérieure à 0.";
      }

      if (!item.pricePerKg || Number(item.pricePerKg) <= 0) {
        validationErrors[`price-${item.id}`] =
          "Le prix au kg doit être supérieur à 0.";
      }
    });

    return validationErrors;
  }, [form]);

  const isFormValid = useMemo(
    () => Object.keys(getValidationErrors()).length === 0,
    [getValidationErrors],
  );

  const updateForm = useCallback(
    <K extends keyof NewOlivePurchaseForm>(
      field: K,
      value: NewOlivePurchaseForm[K],
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setErrors((previous) => {
        if (!previous[field]) return previous;

        const next = { ...previous };
        delete next[field];

        return next;
      });
    },
    [],
  );

  const addItem = useCallback(() => {
    const newItem: OlivePurchaseItemForm = {
      id: crypto.randomUUID(),
      varietyId: null,
      agreedQuantityKg: "",
      pricePerKg: "",
      goesToAnalysis: false,
    };

    setForm((previous) => ({
      ...previous,
      items: [...previous.items, newItem],
    }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next.items;
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.filter((item) => item.id !== id),
    }));

    setErrors((previous) => {
      const next = { ...previous };

      delete next[`variety-${id}`];
      delete next[`quantity-${id}`];
      delete next[`price-${id}`];

      return next;
    });
  }, []);

  const updateItem = useCallback(
    (
      id: string,
      field: keyof OlivePurchaseItemForm,
      value: string | number | boolean | null,
    ) => {
      setForm((previous) => ({
        ...previous,
        items: previous.items.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item,
        ),
      }));

      setErrors((previous) => {
        const next = { ...previous };

        if (field === "varietyId") {
          delete next[`variety-${id}`];
        }

        if (field === "agreedQuantityKg") {
          delete next[`quantity-${id}`];
        }

        if (field === "pricePerKg") {
          delete next[`price-${id}`];
        }

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

      const request: CreateOlivePurchaseParams = {
        supplierName: form.supplierName.trim(),
        purchaseDate: form.purchaseDate,
        status: form.statusId,
        notes: form.notes || null,
        items: form.items.map((item) => ({
          varietyId: item.varietyId,
          agreedQuantityKg: Number(item.agreedQuantityKg),
          pricePerKg: Number(item.pricePerKg),
          goesToAnalysis: item.goesToAnalysis,
        })),
      };

      const success = await createOlivePurchaseAction(request);

      if (success) {
        toast.success("Achat d'olives créé avec succès.");
        navigate("/olive-purchases");
        return;
      }

      toast.error(
        error ?? "Impossible de créer l'achat d'olives.",
      );
    } catch {
      toast.error(
        "Une erreur est survenue lors de la création de l'achat.",
      );

      setErrors({
        general: "Impossible de créer l'achat d'olives.",
      });
    } finally {
      setSaving(false);
    }
  }, [
    form,
    getValidationErrors,
    createOlivePurchaseAction,
    error,
    navigate,
  ]);

  const handleCancel = useCallback(() => {
    if (!saving) {
      navigate("/olive-purchases");
    }
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Nouvel achat d'olives</h1>

          <p className="page-description">
            Créer un nouvel achat d'olives et définir les différentes
            lignes d'achat.
          </p>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>

            <span>
              Informations relatives à l'achat d'olives
            </span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput
              label="Fournisseur"
              value={form.supplierName}
              onChange={(event) =>
                updateForm("supplierName", event.target.value)
              }
            />

            {errors.supplierName && (
              <span className="field-error">
                {errors.supplierName}
              </span>
            )}
          </div>

          <div className="filter-item">
            <TextInput
              label="Date d'achat"
              type="date"
              value={form.purchaseDate}
              onChange={(event) =>
                updateForm("purchaseDate", event.target.value)
              }
            />

            {errors.purchaseDate && (
              <span className="field-error">
                {errors.purchaseDate}
              </span>
            )}
          </div>

          <div className="filter-item">
            <label>Statut</label>

            <Select
              options={statusOptions}
              placeholder={
                constantsLoading
                  ? "Chargement..."
                  : "Sélectionnez un statut"
              }
              value={form.statusId}
              onChange={(event) =>
                updateForm(
                  "statusId",
                  Number(event.target.value),
                )
              }
            />

            {errors.statusId && (
              <span className="field-error">
                {errors.statusId}
              </span>
            )}
          </div>

          <div
            className="filter-item"
            style={{ gridColumn: "1 / -1" }}
          >
            <label>Notes</label>

            <TextEditor
              value={form.notes}
              placeholder="Notes concernant l'achat..."
              onChange={(value) =>
                updateForm("notes", value)
              }
            />
          </div>
        </div>
      </div>

      <NewOlivePurchaseItemsWidget
        items={form.items}
        varietyOptions={varietyOptions}
        errors={errors}
        constantsLoading={constantsLoading}
        saving={saving}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Récapitulatif</h3>

            <span>
              Totaux calculés à partir des lignes d'achat.
            </span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <label>Quantité totale</label>

            <strong>
              {totalQuantityKg.toFixed(2)} kg
            </strong>
          </div>

          <div className="filter-item">
            <label>Prix total</label>

            <strong>
              {totalPrice.toFixed(2)} €
            </strong>
          </div>

          <div className="filter-item">
            <label>Prix moyen / kg</label>

            <strong>
              {pricePerKg.toFixed(2)} € / kg
            </strong>
          </div>
        </div>
      </div>

      {errors.general && (
        <div
          className="field-error"
          style={{ marginTop: "15px" }}
        >
          {errors.general}
        </div>
      )}

      <div className="filters-footer">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={saving}
        >
          Annuler
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={
            saving ||
            constantsLoading ||
            !isFormValid
          }
        >
          {saving ? "Création..." : "Créer l'achat"}
        </Button>
      </div>
    </div>
  );
}