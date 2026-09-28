import { statusColors } from "@olive-platform/core/theme/Colors";
import {
  IconCalendarTime,
  IconLoader2,
  IconCircleCheck,
  IconX,
} from "@tabler/icons-react";
import {
  ProductionStatus,
  type ProductionStatus as ProductionStatusType,
} from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import type { StatusConfig } from "./StatusUtils";

// Mêmes couleurs que les pastilles du tableau de bord.
export const productionStatusConfig: StatusConfig<ProductionStatusType> = {
  [ProductionStatus.Planned]: {
    label: "Planifiée",
    icon: IconCalendarTime,
    ...statusColors.planned,
  },

  [ProductionStatus.InProgress]: {
    label: "En cours",
    icon: IconLoader2,
    ...statusColors.inProgress,
  },

  [ProductionStatus.Completed]: {
    label: "Terminée",
    icon: IconCircleCheck,
    ...statusColors.completed,
  },

  [ProductionStatus.Cancelled]: {
    label: "Annulée",
    icon: IconX,
    ...statusColors.cancelled,
  },
};
