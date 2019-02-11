export function dateToISODate(date: Date): string {
  return (
    date.getUTCFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
}

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}