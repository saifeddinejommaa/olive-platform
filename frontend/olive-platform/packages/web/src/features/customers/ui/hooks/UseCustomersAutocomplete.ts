import { useEffect, useState } from "react";
import type { Customer } from "@olive-platform/core/features/customers/domain/entities/Customer";
import { CustomerRepository } from "@olive-platform/core/features/customers/data/repositories/CustomerRepository";

// Clients actifs correspondant à la saisie (à partir de 2 caractères).
export function useCustomersAutocomplete(search: string) {
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        setResults(await CustomerRepository.getCustomers({ search: search.trim(), isActive: true }));
      } catch {
        // Pas de message à chaque frappe : la liste reste vide.
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return { results, loading };
}
