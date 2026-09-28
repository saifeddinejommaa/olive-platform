import HarvestAutoCompleteWidget from "../../../harvests/ui/widgets/HarvestAutoCompleteWidget";
import OlivePurchaseAutoCompleteWidget from "../../../olivePurchases/ui/widgets/OlivePurchaseAutCompleteWidget";
import type { InitialSource, LotSelection, InputSourceType } from "./InputTypes";

export type SourceOption = {
  id: number;
  reference: string;
  // Lots choisis avec leur quantité (une entrée par lot à la création).
  lots?: LotSelection[];
  quantityKg?: number | null;
};

export type { LotSelection } from "./InputTypes";

type SourceReferenceProps = {
  sourceType: InputSourceType;
  error?: string;
  onSelect: (source: SourceOption) => void;
  // Où afficher la liste des stocks / lignes d'achat (pleine largeur).
  listContainer?: HTMLElement | null;
  // Source présélectionnée : ses lots pressables sont cochés à l'ouverture.
  initialSource?: InitialSource;
};

export default function SourceReference({
  sourceType,
  error,
  onSelect,
  listContainer,
  initialSource,
}: SourceReferenceProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {sourceType === "harvest" ? (
        <HarvestAutoCompleteWidget
          onSelect={onSelect}
          listContainer={listContainer}
          initialSource={initialSource}
        />
      ) : (
        <OlivePurchaseAutoCompleteWidget
          onSelect={onSelect}
          listContainer={listContainer}
          initialSource={initialSource}
        />
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
