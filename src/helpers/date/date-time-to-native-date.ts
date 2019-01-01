import { DateTime } from "../../models/date-time";

export function dateTimeToNativeDate(date: DateTime): Date {
  return new Date(date.year, date.month - 1, date.day, date.hour, date.minute, date.second || 0);
}
