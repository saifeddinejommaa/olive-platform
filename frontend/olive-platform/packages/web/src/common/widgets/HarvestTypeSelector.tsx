import { useEffect } from "react";
import { useConstantsStore } from "@olive-platform/core/features/appConstants/ConstantsStore";
import Select from "./select/Select";

type HarvestTypeSelectorProps = {
  value?: number | null;
  disabled?: boolean;
  onChange: (varietyId: number | null) => void;
};

export default function HarvestTypeSelector({
  value,
  disabled = false,
  onChange,
}: HarvestTypeSelectorProps) {
  const { Appconstants, loading, fetchConstants } = useConstantsStore();

  const harvests = Appconstants.harvestTypes;

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  const options = harvests.map((harvest) => ({
    value: String(harvest.id),
    label: harvest.label,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    onChange(selectedValue === "" ? null : Number(selectedValue));
  };

  return (
    <Select
      options={options}
      placeholder={loading ? "Chargement..." : "Sélectionnez un type de récolte"}
      value={value !== null && value !== undefined ? String(value) : ""}
      onChange={handleChange}
      disabled={disabled || loading}
    />
  );
}
