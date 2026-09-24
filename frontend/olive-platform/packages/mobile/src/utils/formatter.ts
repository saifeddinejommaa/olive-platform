export function formatDateOnly(
  date?: string | null,
  withYear = false,
): string | null {
  if (!date) return null;

  // DateOnly arrive depuis l'API sous la forme "2026-09-21"
  const parts = date.split('-');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;

  return withYear ? `${day}/${month}/${year}` : `${day}/${month}`;
}

export function formatTimeOnly(time?: string | null): string | null {
  if (!time) return null;

  // TimeOnly arrive depuis l'API sous la forme "08:30:00"
  return time.slice(0, 5);
}

export function formatNumberFR(value?: number | null): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('fr-FR');
}