/**
 * Zone-less date-time type. Inspired by Google My Business
 * @see https://developers.google.com/my-business/reference/rest/v4/Date
 */
export interface DateTime {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
}
