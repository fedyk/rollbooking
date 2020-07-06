import { Date } from "./date";

/**
 * Represents a set of time periods when a location's operational hours differ from its normal business hours.
 * @see https://developers.google.com/my-business/reference/rest/v4/accounts.locations#Location.SpecialHourPeriod
 */
export interface SpecialHourPeriod {
  startDate: Date;
  openTime: string;
  endDate: Date;
  closeTime: string;
  isClosed: boolean
}
