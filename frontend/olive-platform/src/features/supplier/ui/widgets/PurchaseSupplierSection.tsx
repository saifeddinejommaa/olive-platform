import { useCallback, useEffect } from "react";

import type { NewSupplierFormValue, SupplierMode } from "../../domain/entities/Supplier";
import Card from "../../../../common/widgets/card/Card";
import SupplierSelector from "../../../../common/widgets/SupplierSelector";
import NewSupplierForm from "./NewSupplierForm";
import { useSupplierStore } from "../stores/SupplierStore";

type PurchaseSupplierSectionProps = {
  mode: SupplierMode;
  supplierId: number | null;
  newSupplier: NewSupplierFormValue;

  onModeChange: (mode: SupplierMode) => void;

  onSupplierChange: (
    supplierId: number | null,
  ) => void;

  onNewSupplierChange: (
    field: keyof NewSupplierFormValue,
    value: string,
  ) => void;

  disabled?: boolean;
};

export default function PurchaseSupplierSection({
  mode,
  supplierId,
  newSupplier,
  onModeChange,
  onSupplierChange,
  onNewSupplierChange,
  disabled = false,
}: PurchaseSupplierSectionProps) {
  const { suppliers, loading, fetchSuppliers } = useSupplierStore();

  useEffect(() => {
    fetchSuppliers().catch(() => {
      // l'erreur est déjà exposée via le state `error` du store
    });
  }, [fetchSuppliers]);

  const handleExistingMode = useCallback(() => {
    onModeChange("existing");
  }, [onModeChange]);

  const handleNewMode = useCallback(() => {
    onModeChange("new");
  }, [onModeChange]);

  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Vendeur / Fournisseur</h3>

          <span>
            Sélectionnez un fournisseur existant ou créez-en
            un nouveau.
          </span>
        </div>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <input
              type="radio"
              name="supplierMode"
              checked={mode === "existing"}
              onChange={handleExistingMode}
              disabled={disabled}
            />

            Fournisseur existant
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <input
              type="radio"
              name="supplierMode"
              checked={mode === "new"}
              onChange={handleNewMode}
              disabled={disabled}
            />

            Nouveau fournisseur
          </label>
        </div>

        {mode === "existing" && (
          <SupplierSelector
            suppliers={suppliers ?? []}
            value={supplierId}
            onChange={onSupplierChange}
            disabled={disabled}
            loading={loading}
          />
        )}

        {mode === "new" && (
          <NewSupplierForm
            value={newSupplier}
            onChange={onNewSupplierChange}
            disabled={disabled}
          />
        )}
      </Card>
    </div>
  );
}