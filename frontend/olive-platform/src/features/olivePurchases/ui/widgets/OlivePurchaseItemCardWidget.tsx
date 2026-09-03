import CollapsibleCard from "../../../../common/widgets/collapsibleCard/CollapsibleCard";
import OlivePurchaseItemInfo from "./OlivePurchaseItemInfo";
import OliveAnalysisInfoWidget from "./OliveAnalysisInfoWidget";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";

type Props = {
  item: OlivePurchaseItemDetails;
};

export default function OlivePurchaseItemCardWidget({ item }: Props) {
  return (
    <CollapsibleCard title={`${item.reference} — ${item.variety}`}>
      <OlivePurchaseItemInfo item={item} />

      {item.analysis && <OliveAnalysisInfoWidget analysis={item.analysis} />}
    </CollapsibleCard>
  );
}
