import { statusColors } from "@olive-platform/core/theme/Colors";
import {
  IconCircleDashed,
  IconChartPie,
  IconLoader2,
  IconCircleCheck,
  IconLock,
} from "@tabler/icons-react";
import {
  HarvestStockStatus,
  type HarvestStockStatus as HarvestStockStatusType,
} from "@olive-platform/core/features/harvests/domain/entities/HarvestStockStatus";
import type { StatusConfig } from "./StatusUtils";

// État de pression d'un lot d'olives (statut du lot vu sous l'angle « pressé ou pas »).
export const oliveLotPressStatusConfig: StatusConfig<HarvestStockStatusType> = {
  [HarvestStockStatus.Available]: {
    label: "Non pressé",
    icon: IconCircleDashed,
    ...statusColors.neutral,
  },

  [HarvestStockStatus.PartiallyUsed]: {
    label: "Partiellement pressé",
    icon: IconChartPie,
    ...statusColors.planned,
  },

  [HarvestStockStatus.Processing]: {
    label: "En pression",
    icon: IconLoader2,
    ...statusColors.inProgress,
  },

  [HarvestStockStatus.Empty]: {
    label: "Pressé",
    icon: IconCircleCheck,
    ...statusColors.completed,
  },

  [HarvestStockStatus.Closed]: {
    label: "Clôturé",
    icon: IconLock,
    ...statusColors.cancelled,
  },
};
