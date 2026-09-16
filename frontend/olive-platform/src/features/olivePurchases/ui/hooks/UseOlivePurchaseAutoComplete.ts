import { useEffect, useState } from "react";
import { GetOlivePurchases } from "../../domain/usecases/GetOlivePurchases";
import type { OlivePurchaseForList } from "../../domain/entities/OlivePurchaseForList";

export function UseOlivePurchaseAutoComplete(serialNumber: string) {
  const [results, setResults] = useState<OlivePurchaseForList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (serialNumber.length === 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await GetOlivePurchases({
          toPressing: true,
          purchaseNumber: serialNumber || undefined,
          pageNumber: 1,
          pageSize: 10,
        });

        setResults(data.items);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [serialNumber]);

  return { results, loading };
}
