import { SelectOption } from "../../../helpers/form";
import { Date as DateObject } from "../../../models/date";
import { dateToISODate } from "../../../helpers/date/date-to-iso-date";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";
import { BookingSlot } from "../../../models/booking-slot";

export function getSelectedDate(dates: SelectOption[], bookingSlots: BookingSlot[] = [], selectedDate?: DateObject): DateObject | null {
  if (selectedDate) {
    const isoDate = dateToISODate(selectedDate);
    const date = dates.find(v => v.value === isoDate);

    if (date) {
      return selectedDate;
    }
  }

  const bookingSlotsByDate = new Map<string, boolean>();

  bookingSlots.forEach(bookingSlot => {
    bookingSlotsByDate.set(dateToISODate(bookingSlot.start), true);
  })

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    if (bookingSlotsByDate.has(date.value)) {
      return isoDateToDateObject(date.value)
    }
  }

  return null;
}
