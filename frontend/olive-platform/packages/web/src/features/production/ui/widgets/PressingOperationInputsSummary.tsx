import type { PressingOperationInput } from "./InputTypes";

// ============================================================
// TYPES
// ============================================================

type PressingOperationInputsSummaryProps = {
  inputs: PressingOperationInput[];
};

// ============================================================
// COMPONENT
// ============================================================

export default function PressingOperationInputsSummary({
  inputs,
}: PressingOperationInputsSummaryProps) {
  const totalOliveQuantity = inputs.reduce(
    (total, input) => total + (Number(input.quantityKg) || 0),
    0,
  );

  return (
    <div
      style={{
        gridColumn: "1 / -1",

        display: "flex",

        justifyContent: "flex-end",

        alignItems: "center",

        paddingTop: "10px",

        fontWeight: "bold",

        fontSize: "18px",
      }}
    >
      Total olives : {totalOliveQuantity.toLocaleString("fr-FR")} kg
    </div>
  );
}
