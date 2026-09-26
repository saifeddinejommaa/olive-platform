export function formatDateOnly(
  date?: string | null,
  withYear = false,
): string | null {
  if (!date) return null;

  // Les dates arrivent depuis l'API au format ISO (ex. "2026-09-21T08:30:00Z")
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

export function formatTimeOnly(time?: string | null): string | null {
  if (!time) return null;

  // Les heures arrivent depuis l'API au format ISO (ex. "2026-09-21T08:30:00Z")
  const parsed = new Date(time);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumberFR(value?: number | null): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('fr-FR');
}