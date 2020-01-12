import { Date as DateObject } from "../../core/types/date";

export function dateObjectToNativeDate(date: DateObject): Date {
  return new Date(date.year, date.month - 1, date.day);
}
