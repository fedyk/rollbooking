import { BookingWorkday } from "./booking-workday";

export interface SalonBookingWorkday extends BookingWorkday {
  salon_id: number;
  created: Date;
}
