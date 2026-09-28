import { useEffect } from "react";

import type { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { useConstantsStore } from "../../stores/ConstantsStore";
import { FilterChoiceField } from "./FilterFields";

type Props = {
  value?: ProductionStatus | null;
  onChange: (value: ProductionStatus | null) => void;
};

// Statut (Planifiée, En cours, …) avec les libellés des constantes de l'API.
export function ProductionStatusFilterField({ value, onChange }: Props) {
  const { Appconstants, fetchConstants } = useConstantsStore();

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  return (
    <FilterChoiceField
      label="Statut"
      value={value ?? null}
      options={Appconstants.productionStatus.map((status) => ({
        value: status.id as ProductionStatus,
        label: status.label,
      }))}
      onChange={onChange}
    />
  );
}
