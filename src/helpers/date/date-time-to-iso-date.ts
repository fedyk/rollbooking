import { DateTime } from "../../core/types/date-time";

export function dateTimeToISODate(date: DateTime): string {
  const year = date.year;
  const month = date.month.toString().padStart(2, "0");
  const day = date.day.toString().padStart(2, "0");
  const hours = date.hours.toString().padStart(2, "0");
  const minutes = date.minutes.toString().padStart(2, "0");
  const seconds = date.seconds.toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
