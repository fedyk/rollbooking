import { Date as DateObject } from "../../models/date";

export function nativeDateToDateObject(date: Date): DateObject {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  }
}
