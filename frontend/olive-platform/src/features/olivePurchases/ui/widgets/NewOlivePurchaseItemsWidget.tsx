import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";
import CheckboxField from "../../../../common/widgets/checkBoxField/CheckboxField";

export type OlivePurchaseItemForm = {
  id: string;
  varietyId: number | null;
  agreedQuantityKg: string;
  pricePerKg: string;
  goesToAnalysis: boolean;
};

type NewOlivePurchaseItemsWidgetProps = {
  items: OlivePurchaseItemForm[];
  varietyOptions: {
    value: string;
    label: string;
  }[];
  errors: Record<string, string>;
  constantsLoading: boolean;
  saving: boolean;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof OlivePurchaseItemForm,
    value: string | number | boolean | null,
  ) => void;
};

export default function NewOlivePurchaseItemsWidget({
  items,
  varietyOptions,
  errors,
  constantsLoading,
  saving,
  onAdd,
  onRemove,
  onUpdate,
}: NewOlivePurchaseItemsWidgetProps) {
  return (
    <div className="filters">
      <div
        className="filters-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3>Lignes d'achat</h3>

          <span>
            Définissez les olives achetées, les quantités et les prix.
          </span>
        </div>

        <Button
          variant="secondary"
          onClick={onAdd}
          disabled={saving}
        >
          Ajouter une ligne
        </Button>
      </div>

      <div className="filters-content">
        {items.length === 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            <span>
              Aucune ligne d'achat. Ajoutez une ligne pour commencer.
            </span>
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={item.id}
            style={{
              gridColumn: "1 / -1",
              padding: "15px 0",
              borderBottom:
                index < items.length - 1
                  ? "1px solid #eee"
                  : "none",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr auto",
                gap: "15px",
                alignItems: "start",
              }}
            >
              <div className="filter-item">
                <label>Variété</label>

                <Select
                  options={varietyOptions}
                  placeholder={
                    constantsLoading
                      ? "Chargement..."
                      : "Sélectionnez une variété"
                  }
                  value={item.varietyId ?? ""}
                  onChange={(event) =>
                    onUpdate(
                      item.id,
                      "varietyId",
                      event.target.value
                        ? Number(event.target.value)
                        : null,
                    )
                  }
                />

                {errors[`variety-${item.id}`] && (
                  <span className="field-error">
                    {errors[`variety-${item.id}`]}
                  </span>
                )}
              </div>

              <div className="filter-item">
                <TextInput
                  label="Quantité (kg)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.agreedQuantityKg}
                  onChange={(event) =>
                    onUpdate(
                      item.id,
                      "agreedQuantityKg",
                      event.target.value,
                    )
                  }
                />

                {errors[`quantity-${item.id}`] && (
                  <span className="field-error">
                    {errors[`quantity-${item.id}`]}
                  </span>
                )}
              </div>

              <div className="filter-item">
                <TextInput
                  label="Prix / kg"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.pricePerKg}
                  onChange={(event) =>
                    onUpdate(
                      item.id,
                      "pricePerKg",
                      event.target.value,
                    )
                  }
                />

                {errors[`price-${item.id}`] && (
                  <span className="field-error">
                    {errors[`price-${item.id}`]}
                  </span>
                )}
              </div>

              <div style={{ paddingTop: "28px" }}>
                <Button
                  variant="secondary"
                  onClick={() => onRemove(item.id)}
                  disabled={saving}
                >
                  Supprimer
                </Button>
              </div>
            </div>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CheckboxField
                label="Procéder à une analyse"
                checked={item.goesToAnalysis}
                onChange={(checked) =>
                  onUpdate(
                    item.id,
                    "goesToAnalysis",
                    checked,
                  )
                }
                disabled={saving}
              />
            </div>
          </div>
        ))}

        {errors.items && (
          <span
            className="field-error"
            style={{ gridColumn: "1 / -1" }}
          >
            {errors.items}
          </span>
        )}
      </div>
    </div>
  );
}