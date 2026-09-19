import { useCallback } from "react";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import CheckboxField from "../../../../common/widgets/checkBoxField/CheckboxField";
import OliveVarietySelector from "../../../../common/widgets/OliveVarietySelector";

export type NewOlivePurchaseItemForm = {
  id: string;
  varietyId: number | null;
  agreedQuantityKg: string;
  pricePerKg: string;
  goesToAnalysis: boolean;
};

type NewOlivePurchaseItemRowProps = {
  item: NewOlivePurchaseItemForm;
  isLast: boolean;

  errors?: {
    variety?: string;
    quantity?: string;
    price?: string;
  };

  disabled?: boolean;

  onUpdateItem: (
    id: string,
    field: keyof NewOlivePurchaseItemForm,
    value: string | number | boolean | null,
  ) => void;

  onRemoveItem: (id: string) => void;
};

export default function NewOlivePurchaseItem({
  item,
  isLast,
  errors,
  disabled = false,
  onUpdateItem,
  onRemoveItem,
}: NewOlivePurchaseItemRowProps) {
  const handleVarietyChange = useCallback(
    (varietyId: number | null) => {
      onUpdateItem(item.id, "varietyId", varietyId);
    },
    [item.id, onUpdateItem],
  );

  const handleQuantityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateItem(item.id, "agreedQuantityKg", event.target.value);
    },
    [item.id, onUpdateItem],
  );

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateItem(item.id, "pricePerKg", event.target.value);
    },
    [item.id, onUpdateItem],
  );

  const handleAnalysisChange = useCallback(
    (checked: boolean) => {
      onUpdateItem(item.id, "goesToAnalysis", checked);
    },
    [item.id, onUpdateItem],
  );

  const handleRemove = useCallback(() => {
    onRemoveItem(item.id);
  }, [item.id, onRemoveItem]);

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr auto auto",
        gap: "15px",
        alignItems: "start",
        padding: "15px 0",
        borderBottom: isLast ? "none" : "1px solid #eee",
      }}
    >
      {/* Variété */}
      <div className="filter-item">
        <label>Variété</label>

        <OliveVarietySelector onChange={handleVarietyChange} value={item.varietyId} />

        {errors?.variety && (
          <span className="field-error">{errors.variety}</span>
        )}
      </div>

      {/* Quantité */}
      <div className="filter-item">
        <TextInput
          label="Quantité (kg)"
          type="number"
          min="0"
          step="0.01"
          value={item.agreedQuantityKg}
          onChange={handleQuantityChange}
          disabled={disabled}
        />

        {errors?.quantity && (
          <span className="field-error">{errors.quantity}</span>
        )}
      </div>

      {/* Prix */}
      <div className="filter-item">
        <TextInput
          label="Prix / kg"
          type="number"
          min="0"
          step="0.01"
          value={item.pricePerKg}
          onChange={handlePriceChange}
          disabled={disabled}
        />

        {errors?.price && (
          <span className="field-error">{errors.price}</span>
        )}
      </div>

      {/* Analyse */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minWidth: "190px",
          height: "100%",
        }}
      >
        <CheckboxField
          label="Procéder à une analyse"
          checked={item.goesToAnalysis}
          onChange={handleAnalysisChange}
          disabled={disabled}
        />
      </div>

      {/* Supprimer */}
      <div style={{ paddingTop: "28px" }}>
        <Button variant="secondary" onClick={handleRemove} disabled={disabled}>
          Supprimer
        </Button>
      </div>
    </div>
  );
}