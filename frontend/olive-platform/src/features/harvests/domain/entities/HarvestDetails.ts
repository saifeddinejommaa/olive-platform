import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";


export interface HarvestDetails {
  id: number;
  reference: string;
  plotId: number;
  plotReference:string;
  variety: OliveVarieties;
  harvestedTrees: number;
  plannedTrees: number;
  harvestDate: string;
  quantityKg: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  status: ProductionStatus;
  startTime: string | null;
  endTime: string | null;
}
