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

export const productionStatusConfig: StatusConfig<ProductionStatusType> = {
  [ProductionStatus.Planned]: {
    label: "Planifiée",
    icon: IconCalendarTime,
    color: "#f59e0b",
  },

  [ProductionStatus.InProgress]: {
    label: "En cours",
    icon: IconLoader2,
    color: "#2563eb",
  },

  [ProductionStatus.Completed]: {
    label: "Terminée",
    icon: IconCircleCheck,
    color: "#16a34a",
  },

  [ProductionStatus.Cancelled]: {
    label: "Annulée",
    icon: IconX,
    color: "#dc2626",
  },
};