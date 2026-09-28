import { statusColors } from "@olive-platform/core/theme/Colors";
import {
  IconEdit,
  IconClock,
  IconCircleCheck,
  IconBox,
  IconX,
} from "@tabler/icons-react";

import {
  PurchaseStatus,
  type PurchaseStatus as PurchaseStatusType,
} from "@olive-platform/core/features/olivePurchases/domain/entities/PurchaseStatus";
import type { StatusConfig } from "./StatusUtils";

// Mêmes tons que les statuts de production (tableau de bord).
export const purchaseStatusConfig: StatusConfig<PurchaseStatusType> = {
  [PurchaseStatus.Draft]: {
    label: "Brouillon",
    icon: IconEdit,
    ...statusColors.neutral,
  },

  [PurchaseStatus.Pending]: {
    label: "En attente",
    icon: IconClock,
    ...statusColors.planned,
  },

  [PurchaseStatus.Approved]: {
    label: "Approuvé",
    icon: IconCircleCheck,
    ...statusColors.inProgress,
  },

  [PurchaseStatus.Received]: {
    label: "Réceptionné",
    icon: IconBox,
    ...statusColors.completed,
  },

  [PurchaseStatus.Cancelled]: {
    label: "Annulé",
    icon: IconX,
    ...statusColors.cancelled,
  },
};
