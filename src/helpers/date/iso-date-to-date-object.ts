import { Date as DateObject } from "../../types/date";
import { nativeDateToDateObject } from "./native-date-to-date-object";

export function isoDateToDateObject(date: any): DateObject {
  date = (date + "").trim();

  const [year, month, day] = date.split("-").map(v => parseInt(v, 10)) as number[];

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }

  if (year <= 1990) {
    return null;
  }

  if (month < 1 || 12 < month) {
    return null;
  }
  
  if (day < 0 || 31 < day) {
    return null;
  }

  const nativeDate = new Date(year, month - 1, day);

  return nativeDateToDateObject(nativeDate);
}
