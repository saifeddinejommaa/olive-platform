export const formatDateTime = (value: Date) => {
  return (
    value.toLocaleDateString("fr-FR") +
    " à " +
    value.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

export const formatStringToDateTime = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
};

export const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const toDateTime = (date: string): string | null => {
  if (!date) return null;
  return `${date}T00:00:00`;
};
