import { Salon } from "../../models/salon";

export function getSalonTimezone(salon: Salon): string {
  return salon && salon.timezone || "";
}
