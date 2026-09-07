import Button from "../../../../common/widgets/button/Button";
import CollapsibleCard from "../../../../common/widgets/collapsibleCard/CollapsibleCard";
import PressingOperationOliveInfo from "./PressingOperationOliveInfo";
import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";
import OliveAnalysisInfoWidget from "../../../olivePurchases/ui/widgets/OliveAnalysisInfoWidget";

type Props = {
  input: PressingOperationInputDetails;
  canEditInputs: boolean;
  saving: boolean;

  onUpdateQuantity: (inputId: number, quantityKg: number) => void;

  onRemove: (inputId: number) => void;
};

export default function PressingOperationOliveCardWidget({
  input,
  canEditInputs,
  saving,
  onUpdateQuantity,
  onRemove,
}: Props) {
  const sourceLabel = input.sourceType === "harvest" ? "Récolte" : "Achat";

  const title = `${sourceLabel} — ${input.sourceReference || "-"}`;

  return (
    <CollapsibleCard title={title}>
      <PressingOperationOliveInfo input={input} />

      {input.analysis && <OliveAnalysisInfoWidget analysis={input.analysis} />}

      <div className="pressing-olive-card-actions">
        {canEditInputs && (
          <Button
            variant="secondary"
            onClick={() => onRemove(input.id)}
            disabled={saving}
          >
            Supprimer
          </Button>
        )}
      </div>
    </CollapsibleCard>
  );
}
