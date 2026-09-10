export interface CreateHarvestParams {
  plotId: number;
  varietyId: number;
  harvestDate: string;
  notes?: string | null;
  plannedTrees: number;
}
