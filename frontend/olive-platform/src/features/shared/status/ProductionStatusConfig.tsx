import AutorenewIcon from '@mui/icons-material/Autorenew';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import type { StatusConfig } from "../utils/StatusUtils";
import {
  ProductionStatus,
  type ProductionStatus as ProductionStatusType,
} from "../../production/domain/entities/ProductionStatus";

export const productionStatusConfig: StatusConfig<ProductionStatusType> = {
  [ProductionStatus.Planned]: {
    label: "Planifiée",
    icon: AutorenewIcon,
    color: "#f59e0b",
  },

  [ProductionStatus.InProgress]: {
    label: "En cours",
    icon: DonutLargeIcon,
    color: "#2563eb",
  },

  [ProductionStatus.Completed]: {
    label: "Terminée",
    icon: CheckCircleIcon,
    color: "#16a34a",
  },

  [ProductionStatus.Cancelled]: {
    label: "Annulée",
    icon: CancelIcon,
    color: "#dc2626",
  },
};
