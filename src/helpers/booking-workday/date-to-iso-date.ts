import { Date } from "../../models/date";

export function workdayISODate(date: Date): string {
  const { year, month, day } = date;
  const yearStr = year.toString().padStart(4, "20");
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");

  return `${yearStr}-${monthStr}-${dayStr}`;
}
