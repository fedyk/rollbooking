import { SelectOption } from "../../../helpers/form";
import { BookingSlot } from "../../../types/booking-slot";
import { dateToISODate } from "../../../helpers/date/date-to-iso-date";

interface Options {
  bookingSlots: BookingSlot[];
}

export function filterDateOptions(options: SelectOption[], { bookingSlots }: Options): SelectOption[] {
  const slotsDateMap = new Map<string, boolean>();

  for (let i = 0; i < bookingSlots.length; i++) {
    const slot = bookingSlots[i];
    const startDate = dateToISODate(slot.start)
    const endDate = dateToISODate(slot.end)

    slotsDateMap.set(startDate, true);
    slotsDateMap.set(endDate, true);  
  }

  return options.filter(v => slotsDateMap.has(v.value));
}
