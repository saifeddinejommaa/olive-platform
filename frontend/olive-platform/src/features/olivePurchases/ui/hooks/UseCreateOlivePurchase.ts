import { useCallback, useState } from "react";
import type { CreateOlivePurchaseParams } from "../../domain/params/CreateOlivePurchaseParams";
import { CreateOlivePurchase } from "../../domain/usecases/CreateOlivePurchase";

export function useCreateOlivePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOlivePurchaseAction = useCallback(
    async (params: CreateOlivePurchaseParams): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await CreateOlivePurchase(params);

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la création de l'achat.";

        setError(message);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    createOlivePurchaseAction,
    loading,
    error,
  };
}