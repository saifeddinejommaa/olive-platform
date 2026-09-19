import type { ChangeEvent } from "react";
import type { Supplier } from "../../features/supplier/domain/entities/Supplier";
import Select from "./select/Select";


type SupplierSelectorProps = {
  suppliers: Supplier[];
  value: number | null;
  onChange: (supplierId: number | null) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
};

export default function SupplierSelector({
  suppliers,
  value,
  onChange,
  disabled = false,
  loading = false,
  error,
}: SupplierSelectorProps) {
    console.log("supplier receive", suppliers)
  const options = suppliers
    .filter((supplier) => supplier.isActive)
    .map((supplier) => ({
      value: supplier.id.toString(),
      label: `${supplier.name} — ${supplier.reference}`,
    }));

  const selectedSupplier = suppliers.find(
    (supplier) => supplier.id === value,
  );
  3
  

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const supplierId = event.target.value
      ? Number(event.target.value)
      : null;

    onChange(supplierId);
  };

  return (
    <div className="filter-item">
      <label>Fournisseur *</label>

      <Select
        options={options}
        placeholder={
          loading
            ? "Chargement des fournisseurs..."
            : "Sélectionnez un fournisseur"
        }
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled || loading}
      />

      {selectedSupplier && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            background: "#fafafa",
          }}
        >
          <strong>{selectedSupplier.name}</strong>

          <div
            style={{
              marginTop: "4px",
              fontSize: "13px",
              color: "#666",
            }}
          >
            Référence : {selectedSupplier.reference}
          </div>

          {selectedSupplier.phone && (
            <div
              style={{
                marginTop: "3px",
                fontSize: "13px",
                color: "#666",
              }}
            >
              Téléphone : {selectedSupplier.phone}
            </div>
          )}

          {selectedSupplier.address && (
            <div
              style={{
                marginTop: "3px",
                fontSize: "13px",
                color: "#666",
              }}
            >
              Adresse : {selectedSupplier.address}
            </div>
          )}
        </div>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}