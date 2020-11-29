import { DateTime } from "../types/date-time";

export function nativeDateToDateTime(date: Date): DateTime {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}
