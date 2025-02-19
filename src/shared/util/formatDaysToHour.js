export function formatDaysToDaysAndHours(days) {
  if (!isFinite(days)) return "Nieskończoność";

  const fullDays = Math.floor(days); // Całkowite dni
  const hours = Math.round((days - fullDays) * 24); // Pozostałe godziny

  let result = "";
  if (fullDays > 0) result += `${fullDays} ${fullDays === 1 ? "dzień" : "dni"}`;
  if (hours > 0) result += `${fullDays > 0 ? ", " : ""}${hours} ${hours === 1 ? "godzina" : "godzin"}`;

  return result || "Mniej niż 1 godzinę";
}