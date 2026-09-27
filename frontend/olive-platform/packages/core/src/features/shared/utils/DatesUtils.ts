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

export const formatStringToDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
};

export const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

export const formatTime = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Date locale au format "YYYY-MM-DD" (DateOnly côté API).
export const toDateOnlyString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDate = () => toDateOnlyString(new Date());

export const toDateTime = (date: string): string | null => {
  if (!date) return null;
  return `${date}T00:00:00`;
};
