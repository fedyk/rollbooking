import { indexBookingSlotsByDate } from "./index-booking-slots-by-date";

test("indexBookingSlotsByDate", function() {

  // TODO: use mocked bookingSlot data
  expect(indexBookingSlotsByDate([])).toEqual(new Map);
})
