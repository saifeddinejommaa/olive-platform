type CheckboxFieldProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export default function CheckboxField({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        style={{
          width: "18px",
          height: "18px",
          margin: 0,
          flexShrink: 0,
        }}
      />

      <div>
        <strong>{label}</strong>

        {description && (
          <div
            style={{
              marginTop: "4px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </label>
  );
}