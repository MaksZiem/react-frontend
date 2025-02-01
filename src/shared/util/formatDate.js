export function formatDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}