import { useEffect } from "react";
import { useConstantsStore } from "../../features/appConstants/ConstantsStore";
import Select from "./select/Select";

type ProductionStatusSelectorProps = {
  value?: number | null;
  disabled?: boolean;
  onChange: (statusId: number | null) => void;
};

export default function ProductionStatusSelector({
  value,
  disabled = false,
  onChange,
}: ProductionStatusSelectorProps) {
  const { Appconstants, loading, fetchConstants } = useConstantsStore();

  const statuses = Appconstants.productionStatus;

  // Charge les constantes si elles ne sont pas encore disponibles
  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  const options = statuses.map((status) => ({
    value: String(status.id),
    label: status.label,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    onChange(selectedValue === "" ? null : Number(selectedValue));
  };

  return (
    <Select
      options={options}
      placeholder={loading ? "Chargement..." : "Sélectionnez un statut"}
      value={value !== null && value !== undefined ? String(value) : ""}
      onChange={handleChange}
      disabled={disabled || loading}
    />
  );
}
