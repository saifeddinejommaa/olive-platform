import { useEffect, useState } from "react";
import type { Plot } from "../../domain/entities/Plot";
import { GetPlots } from "../../domain/usecases/GetPlots";

export function usePlotsAutocomplete(search: string) {
  const [results, setResults] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(
      async () => {
        try {
          setLoading(true);

          const data = await GetPlots({
            reference: search || undefined,
            pageNumber: 1,
            pageSize: 10,
          });

          if (!cancelled) {
            setResults(data.items);
          }
        } catch {
          if (!cancelled) {
            setResults([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
      search ? 300 : 0,
    );

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search]);

  return { results, loading };
}
