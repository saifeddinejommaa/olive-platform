// src/features/shared/status/PurchaseStatusConfig.tsx

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
} from "../../olivePurchases/domain/entities/PurchaseStatus";
import type { StatusConfig } from "../utils/StatusUtils";

export const purchaseStatusConfig: StatusConfig<PurchaseStatusType> = {
  [PurchaseStatus.Draft]: {
    label: "Brouillon",
    icon: IconEdit,
    color: "#f59e0b",
  },

  [PurchaseStatus.Pending]: {
    label: "En attente",
    icon: IconClock,
    color: "#f59e0b",
  },

  [PurchaseStatus.Approved]: {
    label: "Approuvé",
    icon: IconCircleCheck,
    color: "#2563eb",
  },

  [PurchaseStatus.Received]: {
    label: "Réceptionné",
    icon: IconBox,
    color: "#16a34a",
  },

  [PurchaseStatus.Cancelled]: {
    label: "Annulé",
    icon: IconX,
    color: "#dc2626",
  },
};