import type { CostLineType } from "../../../payments/domain/entities/CostLineType";

export type AddHarvestCostLineParams = {
  // Format "YYYY-MM-DD" (DateOnly côté API).
  date: string;
  typeId: CostLineType;
  totalAmount: number;
  description?: string;
  workerName?: string;
  workerIdentifier?: string;
  // true : coût déjà réglé à la saisie.
  isPaid: boolean;
  notes?: string;
};
