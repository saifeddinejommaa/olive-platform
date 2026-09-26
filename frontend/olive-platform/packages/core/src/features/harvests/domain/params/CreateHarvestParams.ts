export interface CreateHarvestParams {
  plotId: number;
  varietyId: number;
  plannedDate: string;
  notes?: string | null;
  plannedTrees: number;
  harvestType: number
}
