import { useEffect } from "react";
import { useConstantsStore } from "../../stores/ConstantsStore";
import Select from "./select/Select";

type PaymentMethodSelectorProps = {
  label?: string;
  value?: number | null;
  disabled?: boolean;
  onChange: (statusId: number | null) => void;
};

export default function PaymentMethodSelector({
  label,
  value,
  disabled = false,
  onChange,
}: PaymentMethodSelectorProps) {
  const {
    Appconstants,
    loading,
    fetchConstants,
  } = useConstantsStore();

  const statuses = Appconstants.paymentMethods;

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  const options = statuses.map((status) => ({
    value: String(status.id),
    label: status.label,
  }));

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value;

    onChange(
      selectedValue === ""
        ? null
        : Number(selectedValue),
    );
  };

  return (
    <Select
      label={label}
      options={options}
      placeholder={
        loading
          ? "Chargement..."
          : "Sélectionnez un statut"
      }
      value={
        value !== null && value !== undefined
          ? String(value)
          : ""
      }
      onChange={handleChange}
      disabled={disabled || loading}
    />
  );
}