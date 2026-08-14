import type { SelectHTMLAttributes } from "react";
import "./Select.css";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">;

export default function Select({
  label,
  options,
  error,
  hint,
  required = false,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="select-field">

      {label && (
        <label className="select-label">
          {label}

          {required && (
            <span className="select-required">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={[
          "select-wrapper",
          error ? "select-wrapper-error" : "",
          props.disabled ? "select-wrapper-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <select
          {...props}
          required={required}
          className={[
            "custom-select",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="select-chevron">
          ▾
        </span>
      </div>

      {error && (
        <div className="select-error-message">
          {error}
        </div>
      )}

      {!error && hint && (
        <div className="select-hint">
          {hint}
        </div>
      )}

    </div>
  );
}