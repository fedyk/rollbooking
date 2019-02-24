import Debug from "debug";
import { ObjectID } from "bson";
import { findTimeZone, getZonedTime } from "timezone-support";
import { addDay } from "../../utils/date";
import { BusinessHours, SpecialHours } from "../../models/salon";
import { Reservation } from "../../models/reservation";
import { DateRange } from "../../lib/date-range";
import { closeClient, ReservationsCollection, SalonsCollection, BookingSlotsCollection } from "../../adapters/mongodb";
import { Date as DateObject } from "../../models/date";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";
import { getBookingSlots } from "../../helpers/booking/get-booking-slots";
import { dateTimeToISODate } from "../../helpers/date/date-time-to-iso-date";
import { BookingSlot } from "../../models/booking-slot";

const debug = Debug("tasks:sync-booking-slots");

export async function syncBookingSlots(salonId: ObjectID, startDate = new Date, endDate = addDay(new Date, 30)) {
  const $salons = await SalonsCollection();
  const $bookingsSlots = await BookingSlotsCollection();
  const $reservations = await ReservationsCollection();
  const salon = await $salons.findOne({ _id: salonId });

  debug("get salon timezone")
  const salonTimezone = findTimeZone(salon.timezone);

  debug("convert local time to time in salon timezone")
  const salonNow = getZonedTime(startDate, salonTimezone);

  const startPeriod: DateObject = {
    year: salonNow.year,
    month: salonNow.month,
    day: salonNow.day
  }

  const salonEndPeriod = getZonedTime(endDate, salonTimezone)

  const endPeriod: DateObject = {
    year: salonEndPeriod.year,
    month: salonEndPeriod.month,
    day: salonEndPeriod.day
  }

  const regularHours: BusinessHours = salon.regularHours || {
    periods: []
  };

  const specialHours: SpecialHours = salon.specialHours || {
    periods: []
  };

  const services = salon.services.items.map(v => ({
    id: v.id,
    duration: v.duration
  }))

  /**
   *     reserv1    reserv2
   * ---|-------|--|-------|---
   *      | <- start   | <- end
   * -----|------------|-------
   * 
   */
  debug("get all reservatins fron current time period")
  const reservations: Reservation[] = await $reservations.find({
    salonId: salon._id,
    start: {
      $lt: endPeriod
    },
    end: {
      $gt: startPeriod
    },
  }).project({
    masterId: 1,
    start: 1,
    end: 1
  }).toArray();

  debug("get bookin slots for current period");
  const slots = getBookingSlots({
    startPeriod,
    endPeriod,
    regularHours,
    specialHours,
    users: salon.employees.users.map(v => ({
      id: v.id.toHexString()
    })),
    services,
    reservations: reservations.map(v => ({
      range: new DateRange(dateTimeToNativeDate(v.start), dateTimeToNativeDate(v.end)),
      userId: v.masterId.toHexString()
    }))
  });

  debug("find available slots for salon");
  const bookingsSlots = await $bookingsSlots.find({
    salonId: salonId
  }).toArray();

  debug("map available slots by uniq key")
  const bookingsSlotsMap = new Map<string, ObjectID>();

  bookingsSlots.forEach(v => {
    const key = `${v.userId.toHexString()}-${v.serviceId}-${dateTimeToISODate(v.start)}-${dateTimeToISODate(v.end)}`;

    bookingsSlotsMap.set(key, v._id);
  })

  const enterBookingSlots: BookingSlot[] = [];

  debug("each and a enter slots")
  slots.forEach(v => {
    const key = `${v.userId}-${v.serviceId}-${dateTimeToISODate(v.start)}-${dateTimeToISODate(v.end)}`;

    if (!bookingsSlotsMap.has(key)) {
      enterBookingSlots.push({
        _version: "v1",
        salonId: salonId,
        userId: new ObjectID(v.userId),
        serviceId: v.serviceId,
        start: v.start,
        end: v.end,
        createdAt: new Date(),
      })
    } else {
      bookingsSlotsMap.delete(key);
    }
  })

  const removeBookingSlots = Array.from(bookingsSlotsMap.values());

  debug("insert a new slots")
  if(enterBookingSlots.length > 0) {
    await $bookingsSlots.insertMany(enterBookingSlots);
  }

  debug("delete not needed slots")
  if(removeBookingSlots.length > 0) {
    await $bookingsSlots.deleteMany({
      _id: {
        $in: removeBookingSlots
      }
    })
  }

  debug("ok, we done here")
}

if (!module.parent) {
  const salonId = new ObjectID(process.argv[2]);

  syncBookingSlots(salonId)
    .then(() => console.log("Done"))
    .catch(err => console.error(err))
    .then(() => closeClient());
}
