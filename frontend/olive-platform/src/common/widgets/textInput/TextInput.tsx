import type { InputHTMLAttributes } from "react";
import "./TextInput.css";

type TextInputProps = {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({
  label,
  error,
  hint,
  required = false,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className="text-input-field">
      {/* Label */}

      {label && (
        <label className="text-input-label">
          {label}

          {required && <span className="text-input-required">*</span>}
        </label>
      )}

      {/* Input */}

      <input
        {...props}
        required={required}
        className={["text-input", error ? "text-input-error" : "", className]
          .filter(Boolean)
          .join(" ")}
      />

      {/* Error */}

      {error && <div className="text-input-error-message">{error}</div>}

      {/* Hint */}

      {!error && hint && <div className="text-input-hint">{hint}</div>}
    </div>
  );
}
