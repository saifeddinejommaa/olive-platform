export interface UpdateHarvestParams {
  plotId?: number;
  plannedTrees?: number;
  plannedDate?: string;
  notes?: string;
  harvestType?: number;
  // Modifiables uniquement pendant la récolte (statut en cours).
  quantityKg?: number;
  harvestedTrees?: number;
}
