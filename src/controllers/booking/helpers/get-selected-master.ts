import { BookingWorkday } from "../../../models/booking-workday";

export function getSelectedMaster(masterId?: string): string {
  if (masterId) {
    return `${masterId}`;
  }

  return '';
}