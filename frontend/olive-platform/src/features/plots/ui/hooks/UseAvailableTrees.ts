import { useEffect, useState } from "react";
import { GetAvailableTrees } from "../../domain/usecases/GetAvailableTrees";

export function useAvailableTrees(plotId: number, varietyId: number) {
  const [availableTrees, setAvailableTrees] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plotId || !varietyId) {
      setAvailableTrees(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await GetAvailableTrees({
          plotId: plotId,
          varietyId: varietyId,
          harvestDate: new Date().toISOString().split("T")[0],
        });

        if (!cancelled) {
          setAvailableTrees(data);
        }
      } catch {
        if (!cancelled) {
          setAvailableTrees(null);
          setError("Impossible de récupérer le nombre d’arbres disponibles.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [plotId, varietyId]);

  return {
    availableTrees,
    loading,
    error,
  };
}
