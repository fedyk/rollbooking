import { BookingSlot } from "../../../base/types/booking-slot";
import { dateToISODate } from "../../../helpers/date/date-to-iso-date";

export function indexBookingSlotsByDate(bookingSlots: BookingSlot[]): Map<string, BookingSlot[]> {
  const map = new Map<string, BookingSlot[]>();

  for (let i = 0; i < bookingSlots.length; i++) {
    const slot = bookingSlots[i];
    const startDate = dateToISODate(slot.start)
    const endDate = dateToISODate(slot.end)

    if (!map.has(startDate)) {
      map.set(startDate, [slot]);
    }
    else {
      map.get(startDate).push(slot);
    }

    if (!map.has(endDate)) {
      map.set(endDate, [slot]);
    }
    else {
      map.get(endDate).push(slot);
    }
  }

  return map;
}
