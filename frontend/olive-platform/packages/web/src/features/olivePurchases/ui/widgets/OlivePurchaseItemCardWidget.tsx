import CollapsibleCard from "../../../../common/widgets/collapsibleCard/CollapsibleCard";
import OlivePurchaseItemInfo from "./OlivePurchaseItemInfo";
import OliveAnalysisInfoWidget from "./OliveAnalysisInfoWidget";
import type { OlivePurchaseItemDetails } from "@olive-platform/core/features/olivePurchases/domain/entities/OlivePurchaseItemDetails";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";

type Props = {
  item: OlivePurchaseItemDetails;
};

export default function OlivePurchaseItemCardWidget({ item }: Props) {
  return (
    <CollapsibleCard title={`${item.reference} — ${getOliveVarietyLabel(item.variety)}`}>
      <OlivePurchaseItemInfo item={item} />

      {item.analysis && <OliveAnalysisInfoWidget analysis={item.analysis} />}
    </CollapsibleCard>
  );
}
