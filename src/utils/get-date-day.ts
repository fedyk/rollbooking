export default function getDateDay(date: Date): number {
  if (date instanceof Date) {
    return date.getDate();
  }

  return null
}
