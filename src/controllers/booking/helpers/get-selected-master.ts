import { BookingWorkday } from "../../../models/booking-workday";

export function getSelectedMaster(masterId?: number): string {
  if (masterId) {
    return `${masterId}`;
  }

  return '';
}