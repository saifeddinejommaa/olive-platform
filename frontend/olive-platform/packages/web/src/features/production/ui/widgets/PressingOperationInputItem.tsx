import { useState } from "react";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Card from "../../../../common/widgets/card/Card";
import Button from "../../../../common/widgets/button/Button";

import SourceReference from "./SourceReference";
import type { SourceOption } from "./SourceReference";

import SourceTypeSelector from "./SourceTypeSelector";

import type { PressingOperationInput, InputSourceType } from "./InputTypes";

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

  onRemove?: (id: string) => void;
};

export default function PressingOperationInputItem({
  input,
  index,
  errors,
  onUpdate,
  onChangeSource,
  onSelectSource,
  onRemove,
}: PressingOperationInputItemProps) {

  const handleChangeSource = (sourceType: InputSourceType) => {

    onUpdate(input.id, "reference", "");

    onUpdate(input.id, "harvestId", null);

    onUpdate(input.id, "purchaseId", null);

    onUpdate(input.id, "quantityKg", "");

    onChangeSource(input.id, sourceType);
  };

  const handleSelectSource = (source: SourceOption) => {
    onSelectSource(input.id, source);

    if (source.quantityKg !== undefined) {
      onUpdate(input.id, "quantityKg", source.quantityKg);
    }
  };

  // Ligne pleine largeur sous la grille : la liste des stocks / lignes d'achat
  // y est affichée, alignée sur le début de la carte.
  const [listContainer, setListContainer] = useState<HTMLDivElement | null>(
    null,
  );

  const sourceError = errors[`input-${input.id}`] ?? errors[`input-${index}`];
  const quantityError =
    errors[`quantity-${input.id}`] ?? errors[`quantity-${index}`];

  return (
    <Card
      headerAction={
        <>
          <span className="card-title">Olives n°{index + 1}</span>

          {onRemove && (
            <Button variant="secondary" onClick={() => onRemove(input.id)}>
              Supprimer
            </Button>
          )}
        </>
      }
    >
      {/* 1. Source */}
      <div className="filter-item">
        <SourceTypeSelector
          value={input.sourceType}
          onChange={handleChangeSource}
        />
      </div>

      {/* 2. Récolte / achat et quantité sur la même ligne */}
      <div className="form-grid-2">
        <div className="filter-item" style={{ minWidth: 0 }}>
          <label>
            {input.sourceType === "harvest" ? "Récolte" : "Achat"}
          </label>
          <SourceReference
            sourceType={input.sourceType}
            error={sourceError}
            onSelect={handleSelectSource}
            listContainer={listContainer}
          />
        </div>

        <div className="filter-item">
          <TextInput
            label="Quantité d'olives (kg)"
            type="number"
            placeholder="500"
            value={input.quantityKg}
            onChange={(event) =>
              onUpdate(input.id, "quantityKg", event.target.value)
            }
          />

          {quantityError && (
            <span className="field-error">{quantityError}</span>
          )}
        </div>
      </div>

      {/* 3. Stocks de la récolte / lignes de l'achat */}
      <div ref={setListContainer} className="source-items-list" />
    </Card>
  );
}
