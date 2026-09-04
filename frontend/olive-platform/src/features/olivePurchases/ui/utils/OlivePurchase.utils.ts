
export const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");
};

export const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return "-";

  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);
};

export const toNumber = (value: string): number => {
  const number = Number(value);

  return Number.isNaN(number) ? 0 : number;
};

export const getAnalysisStatusLabel = (status: number) => {
  switch (status) {
    case 1:
      return "Planifiée";
    case 2:
      return "En cours";
    case 3:
      return "Terminée";
    case 4:
      return "Annulée";
    default:
      return "-";
  }
};

