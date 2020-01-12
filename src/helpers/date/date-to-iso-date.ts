import { Date as DateObject } from "../../core/types/date";
import { nativeDateToDateObject } from "./native-date-to-date-object";

/**
 * Convert Date object to string YYYY-MM-DD. Important: Date string will be in UTC
 */
export function dateToISODate(date: Date | DateObject): string {
  if (date instanceof Date) {
    date = nativeDateToDateObject(date);
  }

  const { year, month, day } = date as DateObject;
  
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
