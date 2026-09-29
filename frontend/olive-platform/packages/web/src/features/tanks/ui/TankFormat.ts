import type { Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";

export const formatLiters = (value: number | null | undefined) =>
  value !== null && value !== undefined
    ? `${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} L`
    : "-";

export const tankStatusLabel = (status: string) =>
  status === "active" ? "Active" : "Inactive";

export const tankTitle = (tank: Pick<Tank, "code" | "name">) =>
  tank.name ? `${tank.code} · ${tank.name}` : tank.code;
