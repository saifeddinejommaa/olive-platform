import { getPlotHarvestStates } from "../../../appConstants/helper/AppConstantsHelper";

// État de récolte d'une parcelle sur la campagne sélectionnée.
export const PlotHarvestState = {
  NotHarvested: 1,
  PartiallyHarvested: 2,
  Harvested: 3,
} as const;

export type PlotHarvestState =
  (typeof PlotHarvestState)[keyof typeof PlotHarvestState];

const defaultPlotHarvestStateOptions: { value: PlotHarvestState; label: string }[] = [
  { value: PlotHarvestState.NotHarvested, label: "Non récoltée" },
  { value: PlotHarvestState.PartiallyHarvested, label: "Partiellement récoltée" },
  { value: PlotHarvestState.Harvested, label: "Récoltée" },
];

// Libellés issus de l'API des constantes (table plot_harvest_state).
export function getPlotHarvestStateOptions(): { value: PlotHarvestState; label: string }[] {
  const states = getPlotHarvestStates();

  return states.length > 0
    ? states.map((state) => ({ value: state.id as PlotHarvestState, label: state.label }))
    : defaultPlotHarvestStateOptions;
}
