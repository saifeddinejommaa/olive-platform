import { useEffect } from "react";

import Button from "../../../../common/widgets/button/Button";
import AddIcon from "@mui/icons-material/Add";

import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import type { PressingOperationInput } from "../widgets/InputTypes";

import NewPressingOperationInputsWidget from "../widgets/NewPressingOperationInputsWidget";

import { usePressingOperationInputsStore } from "../stores/PressingOperationInputsStore";
import PressingOperationOliveCardWidget from "../widgets/PressingOperationInputCardWidget";

type Props = {
  operation: PressingOperationDetails;
  canEditInputs: boolean;
  saving: boolean;

  newInput: PressingOperationInput | null;
  newInputErrors: Record<string, string>;

  onOpenAddInput: () => void;
  onCancelAddInput: () => void;

  onUpdateInputQuantity: (inputId: number, quantityKg: number) => void;

  onRemoveInput: (inputId: number) => void;

  onUpdateNewInput: (
    inputId: string | number,
    field: keyof PressingOperationInput,
    value: string | number | null,
  ) => void;

  onChangeNewInputSource: (
    inputId: string | number,
    sourceType: "harvest" | "purchase",
  ) => void;

  onSelectNewInputSource: (inputId: string | number, source: any) => void;

  onConfirmAddInput: () => void;
};

export default function PressingOperationOlivesTab({
  operation,
  canEditInputs,
  saving,
  newInput,
  newInputErrors,
  onOpenAddInput,
  onCancelAddInput,
  onUpdateInputQuantity,
  onRemoveInput,
  onUpdateNewInput,
  onChangeNewInputSource,
  onSelectNewInputSource,
  onConfirmAddInput,
}: Props) {
  const { inputs, loading, error, fetchInputs, clear } =
    usePressingOperationInputsStore();

  useEffect(() => {
    fetchInputs(operation.id);

    return () => {
      clear();
    };
  }, [operation.id, fetchInputs, clear]);

  const oliveQuantityKg = inputs.reduce(
    (total, input) => total + Number(input.quantityKg ?? 0),
    0,
  );

  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Olives</h3>

          <span>
            Sources d'olives utilisées pour cette opération de pression
          </span>
        </div>

        {canEditInputs && !newInput && (
          <div className="pressing-add-button">
            <Button
              variant="secondary"
              onClick={onOpenAddInput}
              disabled={saving}
            >
              <AddIcon fontSize="small" />
              Ajouter
            </Button>
          </div>
        )}
      </div>

      <div className="filters-content">
        {loading && (
          <div className="pressing-empty-inputs">Chargement des olives...</div>
        )}

        {!loading && error && (
          <div className="field-error pressing-error">{error}</div>
        )}

        {!loading && !error && inputs.length === 0 && (
          <div className="filter-item">
            <span className="filter-item-value">Aucune source d'olives.</span>
          </div>
        )}

        {!loading && !error && inputs.length > 0 && (
          <>
            {inputs.map((input) => (
              <PressingOperationOliveCardWidget
                key={input.id}
                input={input}
                canEditInputs={canEditInputs}
                saving={saving}
                onUpdateQuantity={onUpdateInputQuantity}
                onRemove={onRemoveInput}
              />
            ))}

            <div className="pressing-olive-total">
              <span>Total</span>

              <strong>{oliveQuantityKg.toLocaleString("fr-FR")} kg</strong>
            </div>
          </>
        )}
      </div>

      {newInput && canEditInputs && (
        <div className="pressing-new-input">
          <div className="pressing-new-input-header">
            <h3>Nouvelle source</h3>

            <span>
              Sélectionnez la récolte ou l'achat à utiliser pour cette pression.
            </span>
          </div>

          <NewPressingOperationInputsWidget
            inputs={[newInput]}
            errors={newInputErrors}
            onAdd={() => undefined}
            onRemove={() => undefined}
            onUpdate={(inputId, field, value) =>
              onUpdateNewInput(inputId, field, value)
            }
            onChangeSource={(inputId, sourceType) =>
              onChangeNewInputSource(inputId, sourceType)
            }
            onSelectSource={(inputId, source) =>
              onSelectNewInputSource(inputId, source)
            }
            showAddButton={false}
          />

          <div className="filters-footer pressing-new-input-footer">
            <Button
              variant="secondary"
              onClick={onCancelAddInput}
              disabled={saving}
            >
              Annuler
            </Button>

            <Button
              variant="primary"
              onClick={onConfirmAddInput}
              disabled={saving}
            >
              <AddIcon fontSize="small" />
              Ajouter la source
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
