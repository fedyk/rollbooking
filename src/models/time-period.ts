import { DayOfWeek } from "./dat-of-week";

/**
 * Inspired by Google Business API
 * @see https://developers.google.com/my-business/reference/rest/v4/accounts.locations#Location.TimePeriod
 */
export interface TimePeriod {
  openDay: DayOfWeek;
  openTime: number; // minutes
  closeDay: DayOfWeek;
  closeTime: number; // minutes
}
