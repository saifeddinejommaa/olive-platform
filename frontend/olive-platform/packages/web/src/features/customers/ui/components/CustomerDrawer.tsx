import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import TextInput from "../../../../common/widgets/textInput/TextInput";

import type {
  Customer,
  SaveCustomerParams,
} from "@olive-platform/core/features/customers/domain/entities/Customer";
import { CustomerRepository } from "@olive-platform/core/features/customers/data/repositories/CustomerRepository";

type Props = {
  open: boolean;
  // Client à modifier ; null = création.
  customer: Customer | null;
  onClose: () => void;
  // Identifiant du client créé ou modifié.
  onSaved: (customerId: number, customerName: string) => void;
};

const emptyForm: SaveCustomerParams = {
  name: "",
  phone: "",
  email: "",
  taxId: "",
  address: "",
  notes: "",
  isActive: true,
};

export default function CustomerDrawer({ open, customer, onClose, onSaved }: Props) {
  const [form, setForm] = useState<SaveCustomerParams>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setForm(
      customer
        ? {
            name: customer.name,
            phone: customer.phone ?? "",
            email: customer.email ?? "",
            taxId: customer.taxId ?? "",
            address: customer.address ?? "",
            notes: customer.notes ?? "",
            isActive: customer.isActive,
          }
        : emptyForm,
    );
  }, [open, customer]);

  const update = (field: keyof SaveCustomerParams, value: string | boolean) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Le nom du client est obligatoire.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let customerId = customer?.id ?? 0;

      if (customer) {
        await CustomerRepository.update(customer.id, form);
      } else {
        customerId = await CustomerRepository.create(form);
      }

      toast.success(customer ? "Client modifié." : `Client « ${form.name.trim()} » créé.`);
      onSaved(customerId, form.name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Impossible d'enregistrer le client.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      width={520}
      title={customer ? `Client ${customer.reference}` : "Nouveau client"}
      description="Acheteur d'huile en vrac."
      onClose={() => {
        if (!saving) onClose();
      }}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : customer ? "Enregistrer" : "Créer le client"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextInput
          label="Nom *"
          placeholder="Société ou nom de l'acheteur"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          disabled={saving}
        />
        <TextInput
          label="Téléphone"
          value={form.phone ?? ""}
          onChange={(event) => update("phone", event.target.value)}
          disabled={saving}
        />
        <TextInput
          label="E-mail"
          type="email"
          value={form.email ?? ""}
          onChange={(event) => update("email", event.target.value)}
          disabled={saving}
        />
        <TextInput
          label="Matricule fiscal"
          value={form.taxId ?? ""}
          onChange={(event) => update("taxId", event.target.value)}
          disabled={saving}
        />
        <TextInput
          label="Adresse"
          value={form.address ?? ""}
          onChange={(event) => update("address", event.target.value)}
          disabled={saving}
        />
        <TextInput
          label="Notes"
          value={form.notes ?? ""}
          onChange={(event) => update("notes", event.target.value)}
          disabled={saving}
        />

        {customer && (
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(event) => update("isActive", event.target.checked)}
              disabled={saving}
            />
            Client actif (proposé dans les nouvelles ventes)
          </label>
        )}

        {error && <span className="field-error">{error}</span>}
      </div>
    </Drawer>
  );
}
