import { useEffect, useState } from "react";
import type { OlivePurchase } from "../../domain/entities/OlivePurchase";
import { GetOlivePurchases } from "../../domain/usecases/GetOlivePurchases";

export function UseOlivePurchaseAutoComplete(serialNumber: string) {
  const [results, setResults] = useState<OlivePurchase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!serialNumber || serialNumber.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const data = await GetOlivePurchases({ purchaseNumber: serialNumber, pageNumber: 1, pageSize: 10 });
      setResults(data.items);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [serialNumber]);

  return { results, loading };
}
