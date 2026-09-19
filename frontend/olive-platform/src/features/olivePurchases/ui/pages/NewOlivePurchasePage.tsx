import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import Card from "../../../../common/widgets/card/Card";

import { useCreateOlivePurchase } from "../hooks/UseCreateOlivePurchase";
import type { CreateOlivePurchaseParams } from "../../domain/params/CreateOlivePurchaseParams";
import type { NewSupplierFormValue, SupplierMode } from "../../../supplier/domain/entities/Supplier";
import PurchaseSupplierSection from "../../../supplier/ui/widgets/PurchaseSupplierSection";
import PurchaseStatusSelector from "../../../../common/widgets/PurchaseStatusSelector";
import type { NewOlivePurchaseItemForm } from "../widgets/NewOlivePurchaseItem";
import NewOlivePurchaseItem from "../widgets/NewOlivePurchaseItem";


type NewOlivePurchaseForm = {
  supplierMode: SupplierMode;
  supplierId: number | null;

  newSupplier: NewSupplierFormValue;

  purchaseDate: string;
  statusId: number;
  notes: string;
  items: NewOlivePurchaseItemForm[];
};

const initialForm: NewOlivePurchaseForm = {
  supplierMode: "existing",
  supplierId: null,

  newSupplier: {
    name: "",
    phone: "",
    address: "",
  },

  purchaseDate: new Date().toISOString().split("T")[0],

  statusId: 0,
  notes: "",
  items: [],
};

export default function NewOlivePurchasePage() {
  const navigate = useNavigate();

  const { createOlivePurchaseAction, error } = useCreateOlivePurchase();

  const [form, setForm] = useState<NewOlivePurchaseForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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
          Number(item.agreedQuantityKg || 0) * Number(item.pricePerKg || 0),
        0,
      ),
    [form.items],
  );

  const pricePerKg = useMemo(
    () => (totalQuantityKg > 0 ? totalPrice / totalQuantityKg : 0),
    [totalQuantityKg, totalPrice],
  );

  /*
   * ============================================================
   * Fournisseur
   * ============================================================
   */

  const handleSupplierModeChange = useCallback((mode: SupplierMode) => {
    setForm((previous) => ({
      ...previous,
      supplierMode: mode,
      supplierId: mode === "existing" ? previous.supplierId : null,
    }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next.supplier;
      delete next.supplierName;
      return next;
    });
  }, []);

  const handleSupplierChange = useCallback((supplierId: number | null) => {
    setForm((previous) => ({ ...previous, supplierId }));

    setErrors((previous) => {
      const next = { ...previous };
      delete next.supplier;
      return next;
    });
  }, []);

  const handleNewSupplierChange = useCallback(
    (field: keyof NewSupplierFormValue, value: string) => {
      setForm((previous) => ({
        ...previous,
        newSupplier: { ...previous.newSupplier, [field]: value },
      }));

      setErrors((previous) => {
        const next = { ...previous };
        delete next.supplierName;
        return next;
      });
    },
    [],
  );

  /*
   * ============================================================
   * Validation
   * ============================================================
   */

  const getValidationErrors = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    if (form.supplierMode === "existing" && !form.supplierId) {
      validationErrors.supplier = "Sélectionnez un fournisseur.";
    }

    if (form.supplierMode === "new" && !form.newSupplier.name.trim()) {
      validationErrors.supplierName = "Le nom du fournisseur est obligatoire.";
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
        validationErrors[`variety-${item.id}`] = "Sélectionnez une variété.";
      }

      if (!item.agreedQuantityKg || Number(item.agreedQuantityKg) <= 0) {
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

  /*
   * ============================================================
   * Lignes d'achat
   * ============================================================
   */

  const addItem = useCallback(() => {
    const newItem: NewOlivePurchaseItemForm = {
      id: crypto.randomUUID(),
      varietyId: null,
      agreedQuantityKg: "",
      pricePerKg: "",
      goesToAnalysis: false,
    };

    setForm((previous) => ({ ...previous, items: [...previous.items, newItem] }));

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
      field: keyof NewOlivePurchaseItemForm,
      value: string | number | boolean | null,
    ) => {
      setForm((previous) => ({
        ...previous,
        items: previous.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));

      setErrors((previous) => {
        const next = { ...previous };

        if (field === "varietyId") delete next[`variety-${id}`];
        if (field === "agreedQuantityKg") delete next[`quantity-${id}`];
        if (field === "pricePerKg") delete next[`price-${id}`];

        return next;
      });
    },
    [],
  );

  /*
   * ============================================================
   * Submit
   * ============================================================
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

      const request: CreateOlivePurchaseParams = {
        supplierId: form.supplierMode === "existing" ? form.supplierId : null,
        newSupplier:
          form.supplierMode === "new"
            ? {
                name: form.newSupplier.name.trim(),
                phone: form.newSupplier.phone.trim() || null,
                address: form.newSupplier.address.trim() || null,
              }
            : null,

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

      toast.error(error ?? "Impossible de créer l'achat d'olives.");
    } catch {
      toast.error("Une erreur est survenue lors de la création de l'achat.");
      setErrors({ general: "Impossible de créer l'achat d'olives." });
    } finally {
      setSaving(false);
    }
  }, [form, getValidationErrors, createOlivePurchaseAction, error, navigate]);

  const handleCancel = useCallback(() => {
    if (!saving) {
      navigate("/olive-purchases");
    }
  }, [saving, navigate]);

  return (
    <div className="feature-page">
      <PurchaseSupplierSection
        mode={form.supplierMode}
        supplierId={form.supplierId}
        newSupplier={form.newSupplier}
        onModeChange={handleSupplierModeChange}
        onSupplierChange={handleSupplierChange}
        onNewSupplierChange={handleNewSupplierChange}
        disabled={saving}
      />

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à l'achat d'olives</span>
          </div>
        </div>

        <Card>
          <div className="info-grid">
            <div className="filter-item">
              <TextInput
                label="Date d'achat"
                type="date"
                value={form.purchaseDate}
                onChange={(event) => updateForm("purchaseDate", event.target.value)}
                disabled={saving}
              />

              {errors.purchaseDate && (
                <span className="field-error">{errors.purchaseDate}</span>
              )}
            </div>

            <div className="filter-item">
              <label>Etat</label>

              <PurchaseStatusSelector
                value={form.statusId}
                onChange={(event) => updateForm("statusId", Number(event))}
                disabled={saving}
              />

              {errors.statusId && (
                <span className="field-error">{errors.statusId}</span>
              )}
            </div>

            <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
              <label>Notes</label>

              <TextEditor
                value={form.notes}
                placeholder="Notes concernant l'achat..."
                onChange={(value) => updateForm("notes", value)}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="filters">
        <div
          className="filters-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <h3>Lignes d'achat</h3>
            <span>Définissez les olives achetées, les quantités et les prix.</span>
          </div>

          <Button variant="secondary" onClick={addItem} disabled={saving}>
            Ajouter une ligne
          </Button>
        </div>

        <Card>
          <div className="info-grid">
            {form.items.length === 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <span>Aucune ligne d'achat. Ajoutez une ligne pour commencer.</span>
              </div>
            )}

            {form.items.map((item, index) => (
              <NewOlivePurchaseItem
                key={item.id}
                item={item}
                isLast={index === form.items.length - 1}
                errors={{
                  variety: errors[`variety-${item.id}`],
                  quantity: errors[`quantity-${item.id}`],
                  price: errors[`price-${item.id}`],
                }}
                disabled={saving}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
              />
            ))}

            {errors.items && (
              <span className="field-error" style={{ gridColumn: "1 / -1" }}>
                {errors.items}
              </span>
            )}
          </div>
        </Card>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Récapitulatif</h3>
            <span>Totaux calculés à partir des lignes d'achat.</span>
          </div>
        </div>

        <Card>
          <div className="info-grid">
            <div className="filter-item">
              <label>Quantité totale</label>
              <strong>{totalQuantityKg.toFixed(2)} kg</strong>
            </div>

            <div className="filter-item">
              <label>Prix total</label>
              <strong>{totalPrice.toFixed(2)} €</strong>
            </div>

            <div className="filter-item">
              <label>Prix moyen / kg</label>
              <strong>{pricePerKg.toFixed(2)} € / kg</strong>
            </div>
          </div>
        </Card>
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
          {saving ? "Création..." : "Créer l'achat"}
        </Button>
      </div>
    </div>
  );
}