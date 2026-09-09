import type { ElementType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import CloseIcon from "@mui/icons-material/Close";

export type StatusConfig<T extends string | number> = Record<
  T,
  {
    label: string;
    icon: ElementType<SvgIconProps>;
    color?: string;
  }
>;

export function renderStatus<T extends string | number>(
  status: T,
  config: StatusConfig<T>,
) {
  const statusConfig = config[status];

  // Statut inexistant dans la config : 0, valeur inconnue, etc.
  if (statusConfig === undefined) {
    return (
      <div
        style={{
          width: "fit-content",
          padding: "4px 8px",
          borderRadius: "12px",
          background: "#b4afaf",
          border: "1px solid #d1d5db",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        <CloseIcon fontSize="small" />
        <span>Non planifié</span>
      </div>
    );
  }

  // Ici statusConfig existe forcément
  const Icon = statusConfig.icon;
  const backgroundColor = statusConfig.color ?? "#dc2626";

  return (
    <div
      style={{
        width: "fit-content",
        padding: "4px 8px",
        borderRadius: "12px",
        background: backgroundColor,
        border: "1px solid #d1d5db",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#fff",
      }}
    >
      <Icon fontSize="small" />
      <span>{statusConfig.label}</span>
    </div>
  );
}