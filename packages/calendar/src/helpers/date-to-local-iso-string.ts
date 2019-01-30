export function dateToLocalISOString(date: Date): string {
  return date.getUTCFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds());
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}
