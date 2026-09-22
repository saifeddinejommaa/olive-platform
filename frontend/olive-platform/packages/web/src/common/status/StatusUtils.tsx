import { IconX } from "@tabler/icons-react";
import type { Icon as TablerIconType } from "@tabler/icons-react";
import "./StatusBadge.css"

export type StatusConfig<T extends string | number> = Record<
  T,
  {
    label: string;
    icon: TablerIconType;
    color?: string;
  }
>;

function withAlpha(hexColor: string, alphaHex: string) {
  return `${hexColor}${alphaHex}`;
}

export function renderStatus<T extends string | number>(
  status: T,
  config: StatusConfig<T>,
) {
  const statusConfig = config[status];

  if (statusConfig === undefined) {
    return (
      <div className="status-badge status-badge--neutral">
        <IconX className="status-badge__icon" size={14} stroke={2} />
        <span>Non planifié</span>
      </div>
    );
  }

  const Icon = statusConfig.icon;
  const color = statusConfig.color ?? "#dc2626";

  return (
    <div
      className="status-badge"
      style={{
        background: withAlpha(color, "1A"),
        color,
      }}
    >
      <Icon className="status-badge__icon" size={14} stroke={2} color={color} />
      <span>{statusConfig.label}</span>
    </div>
  );
}