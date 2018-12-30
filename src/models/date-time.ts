import { Date } from "./date";

/**
 * Date Type. Inspered by Google My Business
 * @see https://developers.google.com/my-business/reference/rest/v4/Date
 */
export interface DateTime extends Date {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}
