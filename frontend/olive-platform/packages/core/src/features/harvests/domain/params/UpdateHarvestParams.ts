export interface UpdateHarvestParams {
  plotId?: number;
  plannedTrees?: number;
  harvestedTrees?: number;
  quantityKg?:number;
  harvestDate?: string;
  notes?: string;
  harvestType: number;
}
