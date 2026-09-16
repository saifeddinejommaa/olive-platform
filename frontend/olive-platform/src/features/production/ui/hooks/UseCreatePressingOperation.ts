import { useState } from "react";
import type { CreatePressingOperationParams } from "../../domain/params/CreatePressingOperationParams";
import { CreatePressingOperation } from "../../domain/useCases/CreatePressingOperation";

export const useCreatePressingOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPressingOperationAction = async (
    request: CreatePressingOperationParams,
  ) => {
    setLoading(true);
    setError(null);
    try {
       await CreatePressingOperation(request);
    } catch (e: any) {
      setError(e.message ?? "Unexpected error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPressingOperationAction,
    loading,
    error,
  };
};
