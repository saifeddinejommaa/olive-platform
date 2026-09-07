import { useEffect, useMemo, useState } from "react";
import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import { renderStatus } from "../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../shared/status/ProductionStatusConfig";
import { formatDate } from "../../../shared/utils/DatesUtils";
import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";
import DrawerSummarySection from "../../../../common/widgets/DrawerSummarySection";
import FinishPressingInputSummaryRow from "../widgets/FinishPressingInputSummaryRow";
import CheckboxField from "../../../../common/widgets/checkBoxField/CheckboxField";

type Props = {
  open: boolean;
  saving: boolean;
  operation: PressingOperationDetails;
  inputs: PressingOperationInputDetails[];
  onClose: () => void;
  onConfirm: (oilQuantityLiters: number, proceedOilAnalysis: boolean) => void;
};

const formatLiters = (value: number | null | undefined) =>
  value !== null && value !== undefined
    ? `${value.toLocaleString("fr-FR")} L`
    : "-";

export default function FinishPressingOperationDrawer({
  open,
  saving,
  operation,
  inputs,
  onClose,
  onConfirm,
}: Props) {
  const [oilQuantity, setOilQuantity] = useState("");
  const [proceedOilAnalysis, setProceedOilAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setOilQuantity("");
      setProceedOilAnalysis(false);
      setError(null);
    }
  }, [open]);

  const oliveQuantityKg = inputs.reduce(
    (total, input) => total + Number(input.quantityKg ?? 0),
    0,
  );

  // Valeur déjà calculée et persistée côté backend à la création
  // de l'opération, à partir des analyses des inputs.
  const expectedOilLiters = operation.expectedOilLiters ?? null;

  const enteredOilQuantity = Number(oilQuantity);
  const hasValidEntry =
    oilQuantity !== "" && Number.isFinite(enteredOilQuantity);

  const deviation = useMemo(() => {
    if (expectedOilLiters === null || !hasValidEntry) return null;
    return enteredOilQuantity - expectedOilLiters;
  }, [expectedOilLiters, hasValidEntry, enteredOilQuantity]);

  const deviationPercentage =
    deviation !== null && expectedOilLiters
      ? (deviation / expectedOilLiters) * 100
      : null;

  const handleConfirm = () => {
    const quantity = Number(oilQuantity);

    if (!oilQuantity || !Number.isFinite(quantity) || quantity <= 0) {
      setError("Veuillez renseigner une quantité d'huile produite valide.");
      return;
    }

    setError(null);
    onConfirm(quantity, proceedOilAnalysis);
  };

  return (
    <Drawer
      open={open}
      title="Clôturer la pression"
      description="Vérifiez les olives utilisées et renseignez la quantité d'huile obtenue avant de confirmer la clôture."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>

          <Button variant="primary" onClick={handleConfirm} disabled={saving}>
            {saving ? "Clôture..." : "Confirmer et clôturer"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <DrawerInfoCard label="Opération">
          {operation.operationNumber || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Date de pression">
          {formatDate(operation.pressingDate)}
        </DrawerInfoCard>

        <DrawerInfoCard label="Statut actuel">
          {renderStatus(operation.status, productionStatusConfig)}
        </DrawerInfoCard>

        <DrawerSummarySection
          title="Olives utilisées"
          description="Résumé des sources d'olives et de leurs analyses."
        >
          {inputs.length === 0 && (
            <div style={{ padding: "12px 0", color: "#666", fontSize: "13px" }}>
              Aucune source d'olives.
            </div>
          )}

          {inputs.map((input) => (
            <FinishPressingInputSummaryRow key={input.id} input={input} />
          ))}

          {inputs.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "12px",
                marginTop: "4px",
              }}
            >
              <span>Quantité totale d'olives</span>
              <strong>{oliveQuantityKg.toLocaleString("fr-FR")} kg</strong>
            </div>
          )}
        </DrawerSummarySection>

        <div>
          <TextInput
            label="Quantité d'huile obtenue (L)"
            type="number"
            placeholder="0"
            value={oilQuantity}
            onChange={(event) => {
              setOilQuantity(event.target.value);
              if (error) setError(null);
            }}
            disabled={saving}
          />
          {error && <span className="field-error">{error}</span>}

          {expectedOilLiters !== null && (
            <div
              style={{
                marginTop: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#f0f7ff",
                border: "1px solid #cfe3fb",
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Huile attendue (selon analyses)</span>
                <strong>{formatLiters(expectedOilLiters)}</strong>
              </div>

              {deviation !== null && (
                <div
                  style={{
                    marginTop: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                    color: deviation >= 0 ? "#1a7a3c" : "#b3261e",
                  }}
                >
                  <span>Écart avec la saisie</span>
                  <span>
                    {deviation >= 0 ? "+" : ""}
                    {deviation.toLocaleString("fr-FR")} L
                    {deviationPercentage !== null &&
                      ` (${deviationPercentage >= 0 ? "+" : ""}${deviationPercentage.toFixed(1)} %)`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <CheckboxField
          label="Procéder à une analyse de l'huile"
          description="Une analyse de l'huile sera créée lors de la clôture de la pression."
          checked={proceedOilAnalysis}
          onChange={setProceedOilAnalysis}
          disabled={saving}
        />

        <DrawerConfirmationNotice title="Confirmation">
          Une fois la pression clôturée, elle ne pourra plus être modifiée.
        </DrawerConfirmationNotice>
      </div>
    </Drawer>
  );
}
