import { colors, statusColors } from "@olive-platform/core/theme/Colors";
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

// Mêmes tons que les statuts de production (tableau de bord).
export const harvestStockStatusConfig: StatusConfig<HarvestStockStatusType> = {
  [HarvestStockStatus.Available]: {
    label: "Disponible",
    icon: IconCircleCheck,
    ...statusColors.completed,
  },

  [HarvestStockStatus.PartiallyUsed]: {
    label: "Partiellement utilisé",
    icon: IconChartPie,
    color: colors.olive[600],
    background: colors.olive[100],
  },

  [HarvestStockStatus.Processing]: {
    label: "En traitement",
    icon: IconLoader2,
    ...statusColors.inProgress,
  },

  [HarvestStockStatus.Empty]: {
    label: "Vide",
    icon: IconCircleDashed,
    ...statusColors.neutral,
  },

  [HarvestStockStatus.Closed]: {
    label: "Clôturé",
    icon: IconLock,
    ...statusColors.cancelled,
  },
};
