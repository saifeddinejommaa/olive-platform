import { useEffect, useState } from "react";
import { GetHarvestDetails } from "../../domain/usecases/GetHarvestDetails";
import type { HarvestDetails } from "../../domain/entities/HarvestDetails";

export function useHarvestDetails(harvestId: number | null) {
  const [harvest, setHarvest] = useState<HarvestDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!harvestId) {
      setHarvest(null);
      return;
    }

    let cancelled = false;

    const loadDetails = async () => {
      setLoading(true);

      try {
        const data = await GetHarvestDetails(harvestId);
        if (!cancelled) setHarvest(data);
      } catch {
        if (!cancelled) setHarvest(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [harvestId]);

  return { harvest, loading };
}
