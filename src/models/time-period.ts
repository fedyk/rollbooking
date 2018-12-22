import { DayOfWeek } from "./dat-of-week";

/**
 * Inspired by Google Business API
 * Time in 24hr ISO 8601 extended format (hh:mm). Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field.
 * 
 * @see https://developers.google.com/my-business/reference/rest/v4/accounts.locations#Location.TimePeriod
 */
export interface TimePeriod {
  openDay: DayOfWeek;
  openTime: string;
  closeDay: DayOfWeek;
  closeTime: string;
}
