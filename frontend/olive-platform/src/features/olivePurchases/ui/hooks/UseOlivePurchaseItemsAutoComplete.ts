import { useEffect, useState } from "react";
import { GetOlivePurchaseItems } from "../../domain/usecases/GetOlivePurchaseItems";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";

export function UseOlivePurchaseItems(purchaseId: number | null) {
  const [results, setResults] = useState<OlivePurchaseItemDetails[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!purchaseId) {
      setResults([]);
      setLoading(false);
      return;
    }

    const loadItems = async () => {
      setLoading(true);

      try {
        const data = await GetOlivePurchaseItems(purchaseId);

        setResults(data);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [purchaseId]);

  return {
    results,
    loading,
  };
}
