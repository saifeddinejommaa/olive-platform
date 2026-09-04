import EditNoteIcon from "@mui/icons-material/EditNote";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import CancelIcon from "@mui/icons-material/Cancel";

import type { StatusConfig } from "../utils/StatusUtils";
import {
  PurchaseStatus,
  type PurchaseStatus as PurchaseStatusType,
} from "../../olivePurchases/domain/entities/PurchaseStatus";

export const purchaseStatusConfig: StatusConfig<PurchaseStatusType> = {
  [PurchaseStatus.Draft]: {
    label: "Brouillon",
    icon: EditNoteIcon,
    color: "secondary",
  },

  [PurchaseStatus.Pending]: {
    label: "En attente",
    icon: HourglassEmptyIcon,
    color: "warning",
  },

  [PurchaseStatus.Approved]: {
    label: "Approuvé",
    icon: CheckCircleIcon,
    color: "info",
  },

  [PurchaseStatus.Received]: {
    label: "Réceptionné",
    icon: InventoryIcon,
    color: "success",
  },

  [PurchaseStatus.Cancelled]: {
    label: "Annulé",
    icon: CancelIcon,
    color: "error",
  },
};
