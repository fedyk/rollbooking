export function minutesInDay(date: Date) {
  return Math.floor(date.getTime() % (24 * 60 * 60 * 1000) / 1000 / 60);
}
