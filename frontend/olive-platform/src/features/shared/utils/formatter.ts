export const formatQuantity = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} kg`;
};

export const formatOilQuantity = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} L`;
};

export const formatDeviation = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";

  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toLocaleString("fr-FR")} L`;
};

export const formatMinutes = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} min`;
};

export const formatTemperature = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} °C`;
};

export const formatSpeed = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} tr/min`;
};

export const formatFlowRate = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} kg/h`;
};

export const formatWaterQuantity = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("fr-FR")} L`;
};