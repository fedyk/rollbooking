export function getEndDay(date: Date): Date {
  date = new Date(date.getTime());
  date.setHours(23, 59, 59, 999)
  return date
}
