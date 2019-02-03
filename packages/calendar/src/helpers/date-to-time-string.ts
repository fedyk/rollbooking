/**
 * @example dateToTimeString(new Date) => "19:00"
 */
export function dateToTimeString(date: Date): string {
  return pad(date.getHours()) + ":" + pad(date.getMinutes());
}

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}
