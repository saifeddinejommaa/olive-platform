import type { ChangeEvent } from "react";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import type { NewSupplierFormValue } from "@olive-platform/core/features/supplier/domain/entities/Supplier";

type NewSupplierFormProps = {
  value: NewSupplierFormValue;
  onChange: (
    field: keyof NewSupplierFormValue,
    value: string,
  ) => void;
  errors?: Partial<Record<keyof NewSupplierFormValue, string>>;
  disabled?: boolean;
};

export default function NewSupplierForm({
  value,
  onChange,
  errors = {},
  disabled = false,
}: NewSupplierFormProps) {
  const handleChange =
    (field: keyof NewSupplierFormValue) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="info-grid">
      <div className="filter-item">
        <TextInput
         label="Nom et Prénom"
          required={true}
          value={value.name}
          onChange={handleChange("name")}
          disabled={disabled}
        />

        {errors.name && (
          <span className="field-error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="filter-item">
        <TextInput
          label="Téléphone"
          value={value.phone}
          onChange={handleChange("phone")}
          disabled={disabled}
        />

        {errors.phone && (
          <span className="field-error">
            {errors.phone}
          </span>
        )}
      </div>

      <div
        className="filter-item"
        style={{
          gridColumn: "1 / -1",
        }}
      >
        <TextInput
          label="Adresse"
          value={value.address}
          onChange={handleChange("address")}
          disabled={disabled}
        />

        {errors.address && (
          <span className="field-error">
            {errors.address}
          </span>
        )}
      </div>

      <div
        style={{
          gridColumn: "1 / -1",
          padding: "10px 12px",
          borderRadius: "6px",
          background: "#f8f9fa",
          fontSize: "13px",
          color: "#666",
        }}
      >
        Le fournisseur sera créé automatiquement et associé à
        cet achat.
      </div>
    </div>
  );
}