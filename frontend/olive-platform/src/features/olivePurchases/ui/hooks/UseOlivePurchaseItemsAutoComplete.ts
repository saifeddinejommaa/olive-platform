import { useEffect, useState } from "react";
import { GetOlivePurchaseItems } from "../../domain/usecases/GetOlivePurchaseItems";
import type { OlivePurchaseItem } from "../../domain/entities/OlivePurchaseItem";

export function UseOlivePurchaseItems(purchaseId: number | null) {
  const [results, setResults] = useState<OlivePurchaseItem[]>([]);

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
        const data = await GetOlivePurchaseItems(purchaseId, {
          pageNumber: 1,
          pageSize: 50,
        });

        setResults(data.items);
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
