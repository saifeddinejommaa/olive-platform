import { useEffect } from "react";
import { useConstantsStore } from "../../features/appConstants/ConstantsStore";
import Select from "./select/Select";

type OliveVarietySelectorProps = {
  value?: number | null;
  disabled?: boolean;
  onChange: (varietyId: number | null) => void;
};

export default function OliveVarietySelector({
  value,
  disabled = false,
  onChange,
}: OliveVarietySelectorProps) {
  const { Appconstants, loading, fetchConstants } = useConstantsStore();

  const varieties = Appconstants.oliveVarieties;

  // Charge les constantes si elles ne sont pas encore disponibles
  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  const options = varieties.map((variety) => ({
    value: String(variety.id),
    label: variety.label,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    onChange(selectedValue === "" ? null : Number(selectedValue));
  };

  return (
    <Select
      options={options}
      placeholder={loading ? "Chargement..." : "Sélectionnez une variété"}
      value={value !== null && value !== undefined ? String(value) : ""}
      onChange={handleChange}
      disabled={disabled || loading}
    />
  );
}
