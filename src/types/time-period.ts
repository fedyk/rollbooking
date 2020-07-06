import { DayOfWeek } from "./dat-of-week";
import { TimeOfDay } from "./time-of-day";

/**
 * Inspired by Google Business API:
 *  - "Represents a span of time that the business is open,
 *    starting on the specified open day/time and closing on the specified close day/time.
 *    The closing time must occur after the opening time, for example later in the same day, or on a subsequent day."
 * 
 * Time in 24hr ISO 8601 extended format (hh:mm). Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field.
 * @see https://developers.google.com/my-business/reference/rest/v4/accounts.locations#Location.TimePeriod
 */
export interface TimePeriod {
  openDay: DayOfWeek;
  openTime: TimeOfDay;
  closeDay: DayOfWeek;
  closeTime: TimeOfDay;
}
