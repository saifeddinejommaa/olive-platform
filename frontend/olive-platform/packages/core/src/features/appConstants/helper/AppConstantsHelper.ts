export type AppConstants = {
  oliveVarieties: { id: number; label: string }[];
  costLineTypes: { id: number; label: string }[];
  harvestTypes: { id: number; label: string }[];
  paymentMethods: { id: number; label: string }[];
};

let constants: AppConstants | null = null;

export function setAppConstants(value: AppConstants) {
  constants = value;
}

function getLabel(
  values: { id: number; label: string }[],
  id: number,
): string {
  return values.find((x) => x.id === id)?.label ?? "Inconnue";
}

export function getOliveVarietyLabel(id: number): string {
  return getLabel(constants?.oliveVarieties ?? [], id);
}

export function getCostTypeLabel(id: number): string {
  return getLabel(constants?.costLineTypes ?? [], id);
}

export function getHarvestTypeLabel(id: number): string {
  return getLabel(constants?.harvestTypes ?? [], id);
}

export function getPaymentMethodLabel(id: number): string {
  return getLabel(constants?.paymentMethods ?? [], id);
}