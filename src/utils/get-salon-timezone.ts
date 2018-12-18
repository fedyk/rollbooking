import { Salon } from "../models/salon";
import { getProperty } from "./get-property";

export function getSalonTimezone(salon: Salon): string {
  return getProperty(salon.properties, 'general', 'timezone'); 
}
