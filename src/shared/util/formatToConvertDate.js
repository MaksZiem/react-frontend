export function convertToPolishTime(isoDateString) {
  // Tworzymy obiekt daty z podanego ciągu w formacie ISO
  const date = new Date(isoDateString);

  // Opcje formatowania dla Polski
  const options = {
    timeZone: "Europe/Warsaw", // Strefa czasowa dla Polski
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  // Formatowanie daty z użyciem toLocaleString
  return date.toLocaleString("pl-PL", options);
}

// Przykład użycia
const utcDate = "2024-12-22T12:59:38.840Z";
console.log(convertToPolishTime(utcDate)); // "22.12.2024, 13:59:38"
