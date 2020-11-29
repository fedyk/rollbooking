import { DateTime } from "../types/date-time";

export function dateTimeToNativeDate({ year, month, day, hours = 0, minutes = 0, seconds = 0 }: DateTime): Date {
  return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0);
}
