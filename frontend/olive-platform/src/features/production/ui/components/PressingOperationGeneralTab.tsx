import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";

import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import { formatDate } from "../../../shared/utils/DatesUtils";

type Props = {
  operation: PressingOperationDetails;
  yieldPercentage: string;
  canEditOperation: boolean;
  onNotesChange: (notes: string) => void;
};

const formatQuantity = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${value.toLocaleString("fr-FR")} kg`;
};

const formatOilQuantity = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${value.toLocaleString("fr-FR")} L`;
};

const formatDeviation = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "-";
  }

  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toLocaleString("fr-FR")} L`;
};

export default function PressingOperationGeneralTab({
  operation,
  yieldPercentage,
  canEditOperation,
  onNotesChange,
}: Props) {
  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Informations générales</h3>

          <span>Informations relatives à l'opération de pression</span>
        </div>
      </div>

      <div className="filters-content">
        <InfoFieldWidget
          label="Numéro d'opération"
          value={operation.operationNumber}
        />

        <InfoFieldWidget
          label="Date de planification"
          value={formatDate(operation.pressingDate)}
        />

        <InfoFieldWidget
          label="Quantité d'olives"
          value={formatQuantity(operation.oliveQuantityKg)}
        />

        <InfoFieldWidget
          label="Huile produite"
          value={formatOilQuantity(operation.oilQuantityLiters)}
        />

        <InfoFieldWidget
          label="Huile attendue"
          value={formatOilQuantity(operation.expectedOilLiters)}
        />

        <InfoFieldWidget
          label="Écart de rendement"
          value={formatDeviation(operation.oilYieldDeviationLiters)}
        />

        <InfoFieldWidget
          label="Rendement"
          value={yieldPercentage ? `${yieldPercentage} %` : "-"}
        />

        <InfoFieldWidget
          label="Date de lancement"
          value={formatDate(operation.startTime)}
        />

        <InfoFieldWidget
          label="Date de fin"
          value={formatDate(operation.endTime)}
        />

        <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
          <span className="filter-item-label">Notes</span>

          <TextEditor
            value={operation.notes ?? ""}
            placeholder="Notes concernant l'opération..."
            onChange={onNotesChange}
          />
        </div>
      </div>
    </div>
  );
}
