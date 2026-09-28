import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SkipOliveLotAnalysis } from "@olive-platform/core/features/oliveLots/domain/usecases/SkipOliveLotAnalysis";
import OlivePurchaseItemCardWidget from "../widgets/OlivePurchaseItemCardWidget";
import { useOlivePurchaseItemsStore } from "@olive-platform/core/features/olivePurchases/stores/OlivePurchaseItemsStore";

type Props = {
  purchaseId: number;
};

export default function OlivePurchaseItemsTab({ purchaseId }: Props) {
  const { items, fetchItems } = useOlivePurchaseItemsStore();

  useEffect(() => {
    fetchItems(purchaseId);
  }, [purchaseId, fetchItems]);

  const [skippingId, setSkippingId] = useState<number | null>(null);

  // « Passer sans analyse » : le lot devient pressable.
  const handleSkipAnalysis = async (itemId: number) => {
    setSkippingId(itemId);

    try {
      await SkipOliveLotAnalysis(itemId);
      await fetchItems(purchaseId);
    } catch (error: any) {
      toast.error(error?.message ?? "Impossible de passer le lot sans analyse.");
    } finally {
      setSkippingId(null);
    }
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Olives</h3>
          <span>Détail des lots liés à cet achat</span>
        </div>
      </div>

      <div className="grid-content">
        {items.map((item) => (
          <OlivePurchaseItemCardWidget
            key={item.id}
            item={item}
            onSkipAnalysis={handleSkipAnalysis}
            skipping={skippingId === item.id}
          />
        ))}

        {items.length === 0 && (
          <div className="filter-item">
            <span className="filter-item-value">Aucun lot pour cet achat.</span>
          </div>
        )}
      </div>
    </div>
  );
}
