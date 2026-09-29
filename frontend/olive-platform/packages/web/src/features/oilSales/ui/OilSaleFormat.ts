// Montants en dinars (3 décimales : millimes).
export const formatAmount = (value: number | null | undefined) =>
  value !== null && value !== undefined
    ? `${Number(value).toLocaleString("fr-FR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })} DT`
    : "-";

export const formatQuantity = (value: number | null | undefined, unit: "L" | "kg") =>
  value !== null && value !== undefined
    ? `${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ${unit}`
    : "-";

export const formatSaleDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR");
