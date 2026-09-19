import { useEffect } from "react";
import { useConstantsStore } from "../../features/appConstants/ConstantsStore";
import Select from "./select/Select";

type PurchaseStatusProps = {
  value?: number | null;
  disabled?: boolean;
  onChange: (varietyId: number | null) => void;
};

export default function PurchaseStatusSelector({
  value,
  disabled = false,
  onChange,
}: PurchaseStatusProps) {
  const { Appconstants, loading, fetchConstants } = useConstantsStore();

  const statuses = Appconstants.purchaseStatus;

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
      placeholder={loading ? "Chargement..." : "Sélectionnez un état"}
      value={value !== null && value !== undefined ? String(value) : ""}
      onChange={handleChange}
      disabled={disabled || loading}
    />
  );
}
