import { DateTime } from "../../models/date-time";
import { nativeDateToDateTime } from "./native-date-to-date-time";

/**
 * "yyyy-mm-ddThh-mm-ss" -> DateTime
 */
export function isoDateTimeToDateTime(dateTime: any): DateTime {
  dateTime = dateTime + ``;

  if (dateTime.indexOf("T") === -1) {
    return null;
  }

  const [ date, time ] = dateTime.split("T");

  if (!date || !time) {
    return null;
  }

  const [year, month, day] = date.split("-").map(v => parseInt(v, 10)) as number[];
  const [hours, minutes, seconds] = time.split(":").map(v => parseInt(v, 10)) as number[];

  const nativeDate = new Date(year, month - 1, day, hours, minutes, seconds);

  if (isNaN(nativeDate.getTime())) {
    return null;
  }

  return nativeDateToDateTime(nativeDate);
}
