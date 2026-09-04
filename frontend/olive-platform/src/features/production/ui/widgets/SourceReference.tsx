
import HarvestAutoCompleteWidget from "../../../harvests/ui/widgets/HarvestAutoCompleteWidget";
import OlivePurchaseAutoCompleteWidget from "../../../olivePurchases/ui/widgets/OlivePurchaseAutCompleteWidget";
import type { InputSourceType } from "./InputTypes";

export type SourceOption = {
  id: number;
  reference: string;
  purchaseItemIds?: number[];
  quantityKg?: number | null;
};

type SourceReferenceProps = {
  sourceType: InputSourceType;
  error?: string;
  onSelect: (source: SourceOption) => void;
};

export default function SourceReference({ sourceType, error, onSelect }: SourceReferenceProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {sourceType === "harvest" ? (
        <HarvestAutoCompleteWidget onSelect={onSelect} />
      ) : (
        <OlivePurchaseAutoCompleteWidget onSelect={onSelect} />
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
