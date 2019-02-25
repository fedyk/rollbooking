import { syncBookingSlots } from "./sync-booking-slots";
import { Salon } from "../../models/salon";
import { createTestSalon } from "./create-test-salon";
import { deleteTestSalon } from "./delete-test-salon";
import { BookingSlotsCollection, closeClient } from "../../adapters/mongodb";

describe("syncBookingSlots", function() {
  let salon: Salon;

  beforeAll(async function() {
    salon = await createTestSalon();
  });

  afterAll(async function() {
    await deleteTestSalon(salon._id.toHexString());
    await closeClient();
  })

  it("should generate booking slots for salon", async function() {
    const $bookingSlots = await BookingSlotsCollection();

    await syncBookingSlots(salon._id, new Date(2018, 11, 31), new Date(2018, 11, 31));

    const bookingSlots = await $bookingSlots.find({ salonId: salon._id }).project({
      start: 1,
      end: 1,
      userId: 1,
      serviceId: 1
    }).toArray();

    expect(bookingSlots.length).toEqual(salon.employees.users.length * salon.services.items.length * (salon.regularHours.periods[0].closeTime.hours - salon.regularHours.periods[0].openTime.hours))
    // TODO: add more test to cover more corner cases
  })
})
