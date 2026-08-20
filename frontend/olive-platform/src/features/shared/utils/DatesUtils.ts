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