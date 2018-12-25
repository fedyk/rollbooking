export function addMinutes(date: Date, minutes: number): Date {
  const clone = new Date(date.getTime());

  clone.setMinutes(clone.getMinutes() + minutes);

  return clone;
}