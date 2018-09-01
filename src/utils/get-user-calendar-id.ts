import { SalonUser } from "../models/salon-user";
import { getProperty } from "./get-property";

export function getUserCalendarId(user: SalonUser): string {
  return getProperty(user.properties, 'google', 'calendar_id');
}
