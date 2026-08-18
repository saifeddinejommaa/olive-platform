import { useEffect, useState } from "react";
import { GetOlivePurchaseItems } from "../../domain/usecases/GetOlivePurchaseItems";
import type { OlivePurchaseItem } from "../../domain/entities/OlivePurchaseItem";

export function UseOlivePurchaseAutoComplete(purchaseId: number) {
  const [results, setResults] = useState<OlivePurchaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("query", purchaseId)
    if (!purchaseId || purchaseId<0) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const data = await GetOlivePurchaseItems(purchaseId,{pageNumber: 1, pageSize: 50 });
      console.log("data", data)
      setResults(data.items);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [purchaseId]);

  return { results, loading };
}
