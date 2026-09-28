import { useEffect, useState } from "react";
import { GetHarvestStocks } from "../domain/usecases/GetHarvestStocks";
import type { HarvestStockDetails } from "../domain/entities/HarvestStockDetails";

export function useHarvestStocks(harvestId: number | null) {
  const [HarvestStock, setStock] = useState<HarvestStockDetails[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Incrémenté pour recharger les stocks (ex. après « Passer sans analyse »).
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!harvestId) {
      setStock(null);
      return;
    }

    let cancelled = false;

    const loadDetails = async () => {
      setLoading(true);

      try {
        const data = await GetHarvestStocks(harvestId);
        if (!cancelled) setStock(data);
      } catch {
        if (!cancelled) setStock(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [harvestId, version]);

  const reload = () => setVersion((current) => current + 1);

  return { HarvestStock, loading, reload };
}
