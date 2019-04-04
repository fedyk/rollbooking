import { filterDateOptions } from "./filter-date-options";
import { BookingSlot } from "../../../models/booking-slot";

test("filterDateOptions", function() {
  const bookingSlots = new Map<string, BookingSlot[]>();

  // TODO: use mocked data options
  expect(filterDateOptions([], { bookingSlots })).toEqual([]);
})