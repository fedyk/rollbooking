import { Date as DateObject } from "../../base/types/date";

export function nativeDateToDateObject(date: Date): DateObject {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}
