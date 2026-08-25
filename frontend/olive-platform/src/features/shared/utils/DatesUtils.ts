export const formatDateTime =  (value: Date) => {
  return (
    value.toLocaleDateString('fr-FR') +
    ' à ' +
    value.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
}

export const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toDateTime = (date: string): string | null => {
  if (!date) return null
  return `${date}T00:00:00`
}