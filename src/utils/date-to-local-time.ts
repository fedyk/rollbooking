export default function dateToLocalTime(date: Date): string {
  return `${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`;
}
