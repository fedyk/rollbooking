import { SelectOption } from "../../../helpers/form";
import { BookingSlot } from "../../../core/types/booking-slot";

interface Options {
  bookingSlots: Map<string, BookingSlot[]>;
}

export function filterDateOptions(options: SelectOption[], { bookingSlots }: Options): SelectOption[] {
  return options.filter(v => bookingSlots.has(v.value) && bookingSlots.get(v.value).length > 0);
}
