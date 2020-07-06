export function getStartDay(date: Date): Date {
  date = new Date(date.getTime());
  date.setHours(0, 0, 0, 0)
  return date
}
