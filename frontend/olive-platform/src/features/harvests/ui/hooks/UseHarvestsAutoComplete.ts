import { useEffect, useState } from "react";
import type { Harvest } from "../../domain/entities/Harvest";
import { GetHarvests } from "../../domain/usecases/GetHarvests";

export function useHarvestsAutocomplete(serialNumber: string) {
  const [results, setResults] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!serialNumber || serialNumber.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const data = await GetHarvests({ toPressing:true, harvestNumber: serialNumber, pageNumber: 1, pageSize: 10 });
      setResults(data.items);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [serialNumber]);

  return { results, loading };
}
