import { Date as DateObject } from "../types/date";
import { nativeDateToDateObject } from "./native-date-to-date-object";

export function isoDateToDateObject(date: string): DateObject {
  date = (date + "").trim();

  const [year, month, day] = date.split("-").map(v => parseInt(v, 10)) as number[];

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new RangeError("invalid date format")
  }

  if (year <= 1990) {
    throw new RangeError("invalid date format")
  }

  if (month < 1 || 12 < month) {
    throw new RangeError("invalid date format")
  }
  
  if (day < 0 || 31 < day) {
    throw new RangeError("invalid date format")
  }

  const nativeDate = new Date(year, month - 1, day);

  return nativeDateToDateObject(nativeDate);
}
