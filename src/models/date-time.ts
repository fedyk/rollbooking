/**
 * Zone-less date-time type. Inspered by Google My Business
 * @see https://developers.google.com/my-business/reference/rest/v4/Date
 */
export interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}