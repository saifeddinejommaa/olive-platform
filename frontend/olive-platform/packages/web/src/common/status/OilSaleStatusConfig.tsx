import { statusColors } from "@olive-platform/core/theme/Colors";
import { IconCircleCheck, IconFilePencil, IconX } from "@tabler/icons-react";
import {
  OilSaleStatus,
  type OilSaleStatus as OilSaleStatusType,
} from "@olive-platform/core/features/oilSales/domain/entities/OilSale";
import type { StatusConfig } from "./StatusUtils";

// Mêmes couleurs que les autres statuts de l'application.
export const oilSaleStatusConfig: StatusConfig<OilSaleStatusType> = {
  [OilSaleStatus.Draft]: {
    label: "Brouillon",
    icon: IconFilePencil,
    ...statusColors.planned,
  },

  [OilSaleStatus.Delivered]: {
    label: "Livrée",
    icon: IconCircleCheck,
    ...statusColors.completed,
  },

  [OilSaleStatus.Cancelled]: {
    label: "Annulée",
    icon: IconX,
    ...statusColors.cancelled,
  },
};
