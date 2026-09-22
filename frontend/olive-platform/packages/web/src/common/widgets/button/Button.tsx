import React from "react";
import "./Button.css";

type ButtonProps = {
  children: React.ReactNode;

  variant?: "primary" | "secondary" | "outline" | "danger" | "gold";

  size?: "sm" | "md" | "lg";

  type?: "button" | "submit" | "reset";

  disabled?: boolean;

  fullWidth?: boolean;

  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
