import {
  IconCircleCheck,
  IconChartPie,
  IconLoader2,
  IconCircleDashed,
  IconLock,
} from "@tabler/icons-react";
import {
  HarvestStockStatus,
  type HarvestStockStatus as HarvestStockStatusType,
} from "@olive-platform/core/features/harvests/domain/entities/HarvestStockStatus";
import type { StatusConfig } from "./StatusUtils";

export const harvestStockStatusConfig: StatusConfig<HarvestStockStatusType> = {
  [HarvestStockStatus.Available]: {
    label: "Disponible",
    icon: IconCircleCheck,
    color: "#16a34a",
  },

  [HarvestStockStatus.PartiallyUsed]: {
    label: "Partiellement utilisé",
    icon: IconChartPie,
    color: "#f59e0b",
  },

  [HarvestStockStatus.Processing]: {
    label: "En traitement",
    icon: IconLoader2,
    color: "#2563eb",
  },

  [HarvestStockStatus.Empty]: {
    label: "Vide",
    icon: IconCircleDashed,
    color: "#6b7280",
  },

  [HarvestStockStatus.Closed]: {
    label: "Clôturé",
    icon: IconLock,
    color: "#dc2626",
  },
};
