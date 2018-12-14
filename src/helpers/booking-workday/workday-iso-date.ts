import { BookingWorkday } from "../../models/booking-workday";

export function workdayISODate(bookingWorkday: BookingWorkday): string {
  const { year, month, day } = bookingWorkday;
  const yearStr = year.toString().padStart(4, "20");
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");

  return `${yearStr}-${monthStr}-${dayStr}`;
}
