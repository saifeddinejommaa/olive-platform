import { useEffect, useState } from "react";
import type { PressingOperation } from "../../domain/entities/PressingOperation";
import { GetPressingOperations } from "../../domain/useCases/GetPressingOperations";

export function usePressingOperationsAutocomplete(reference: string) {
  const [results, setResults] = useState<PressingOperation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (reference.length === 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await GetPressingOperations({
          operationNumber: reference,
          pageNumber: 1,
          pageSize: 10,
        });

        setResults(data.items);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [reference]);

  return { results, loading };
}
