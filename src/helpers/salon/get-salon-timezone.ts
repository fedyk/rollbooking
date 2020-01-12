import { Salon } from "../../core/types/salon";

export function getSalonTimezone(salon: Salon): string {
  return salon && salon.timezone || "";
}
