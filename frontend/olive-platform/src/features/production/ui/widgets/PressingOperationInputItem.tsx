import TextInput from "../../../../common/widgets/textInput/TextInput";

import SourceReference from "./SourceReference";
import type { SourceOption } from "./SourceReference";

import SourceTypeSelector from "./SourceTypeSelector";

import type { PressingOperationInput, InputSourceType } from "./InputTypes";

// ============================================================
// TYPES
// ============================================================

type PressingOperationInputItemProps = {
  input: PressingOperationInput;

  index: number;

  errors: Record<string, string>;

  onUpdate: (
    id: string,
    field: keyof PressingOperationInput,
    value: string | number | null,
  ) => void;

  onChangeSource: (id: string, sourceType: InputSourceType) => void;

  onSelectSource: (id: string, source: SourceOption) => void;
};

// ============================================================
// COMPONENT
// ============================================================

export default function PressingOperationInputItem({
  input,
  index,
  errors,
  onUpdate,
  onChangeSource,
  onSelectSource,
}: PressingOperationInputItemProps) {
  // ==========================================================
  // CHANGE SOURCE TYPE
  // ==========================================================

  const handleChangeSource = (sourceType: InputSourceType) => {
    // On remet à zéro les informations liées
    // à l'ancienne source.

    onUpdate(input.id, "reference", "");

    onUpdate(input.id, "harvestId", null);

    onUpdate(input.id, "purchaseItemId", null);

    onUpdate(input.id, "quantityKg", "");

    // Puis on change le type de source.
    onChangeSource(input.id, sourceType);
  };

  // ==========================================================
  // SOURCE SELECTION
  // ==========================================================

  const handleSelectSource = (source: SourceOption) => {
    onSelectSource(input.id, source);

    // Si la source possède une quantité disponible,
    // on la récupère automatiquement.

    if (source.quantityKg !== undefined) {
      onUpdate(input.id, "quantityKg", source.quantityKg);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* ======================================================
          SOURCE TYPE
      ====================================================== */}

      <SourceTypeSelector
        value={input.sourceType}
        onChange={handleChangeSource}
      />

      {/* ======================================================
          SOURCE REFERENCE
      ====================================================== */}

      <SourceReference
        sourceType={input.sourceType}
        error={errors[`input-${input.id}`] ?? errors[`input-${index}`]}
        onSelect={handleSelectSource}
      />

      {/* ======================================================
          QUANTITY
      ====================================================== */}

      <div>
        <TextInput
          label="Quantité d'olives (kg)"
          type="number"
          placeholder="500"
          value={input.quantityKg}
          onChange={(event) =>
            onUpdate(input.id, "quantityKg", event.target.value)
          }
        />

        {(errors[`quantity-${input.id}`] ?? errors[`quantity-${index}`]) && (
          <span className="field-error">
            {errors[`quantity-${input.id}`] ?? errors[`quantity-${index}`]}
          </span>
        )}
      </div>
    </div>
  );
}
