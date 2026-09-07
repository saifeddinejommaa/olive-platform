import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";

type Props = {
  input: PressingOperationInputDetails;
};

const formatPercentage = (value?: number | null) =>
  value !== undefined && value !== null ? `${value} %` : "-";

export default function FinishPressingInputSummaryRow({ input }: Props) {
  const sourceTypeLabel = input.sourceType === "harvest" ? "Récolte" : "Achat";

  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <strong>
          {sourceTypeLabel} — {input.sourceReference}
        </strong>

        <strong>{input.quantityKg} kg</strong>
      </div>

      {input.analysis && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "13px",
            color: "#6b7280",
            flexWrap: "wrap",
          }}
        >
          <span>
            Humidité : {formatPercentage(input.analysis.humidityPercentage)}
          </span>
          <span>Eau : {formatPercentage(input.analysis.waterPercentage)}</span>
          <span>Huile : {formatPercentage(input.analysis.oilPercentage)}</span>
          <span>
            Acidité : {formatPercentage(input.analysis.acidityPercentage)}
          </span>
        </div>
      )}

      {!input.analysis && (
        <div style={{ fontSize: "13px", color: "#999" }}>
          Aucune analyse disponible.
        </div>
      )}
    </div>
  );
}
