import { useConstantsStore } from "../ConstantsStore";

export function getOliveVarietyLabel(varietyId: number): string {
  const { Appconstants } = useConstantsStore.getState();

  return (
    Appconstants.oliveVarieties.find((variety) => variety.id === varietyId)
      ?.label ?? "Inconnue"
  );
}

export function getCostTypeLabel(costLineId: number): string {
  const { Appconstants } = useConstantsStore.getState();
  return (
    Appconstants.costLineTypes.find((line) => line.id === costLineId)
      ?.label ?? "Inconnue"
  );
}
