import Button from "../../../../common/widgets/button/Button";

// ============================================================
// TYPES
// ============================================================

type PressingOperationInputsFooterProps = {
  onAdd: () => void;
};

// ============================================================
// COMPONENT
// ============================================================

export default function PressingOperationInputsFooter({
  onAdd,
}: PressingOperationInputsFooterProps) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",

        display: "flex",

        justifyContent: "flex-end",

        marginTop: "10px",
      }}
    >
      <Button variant="primary" onClick={onAdd}>
        + Ajouter une source
      </Button>
    </div>
  );
}
