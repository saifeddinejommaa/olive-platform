import EditNoteIcon from "@mui/icons-material/EditNote";
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import InventoryIcon from "@mui/icons-material/Inventory";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  PurchaseStatus,
  type PurchaseStatus as PurchaseStatusType,
} from "../../olivePurchases/domain/entities/PurchaseStatus";
import type { StatusConfig } from "../utils/StatusUtils";

export const purchaseStatusConfig: StatusConfig<PurchaseStatusType> = {
  [PurchaseStatus.Draft]: {
    label: "Brouillon",
    icon: EditNoteIcon,
   color: "#f59e0b",
  },

  [PurchaseStatus.Pending]: {
    label: "En attente",
   icon: PendingIcon,
    color: "#f59e0b",
  },

  [PurchaseStatus.Approved]: {
    label: "Approuvé",
    icon: CheckCircleIcon,
    color: "#2563eb",
  },

  [PurchaseStatus.Received]: {
    label: "Réceptionné",
    icon: InventoryIcon,
    color: "#16a34a",
  },

  [PurchaseStatus.Cancelled]: {
    label: "Annulé",
    icon: CancelIcon,
    color: "#dc2626",
  },
};
