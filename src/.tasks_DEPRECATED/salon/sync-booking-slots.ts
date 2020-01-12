import Debug from "debug";
import { ok } from "assert";
import { ObjectID } from "bson";
import { findTimeZone, getZonedTime } from "timezone-support";
import { addDay } from "../../utils/date";
import { BusinessHours, SpecialHours } from "../../types/salon";
import { Reservation } from "../../types/reservation";
import { DateRange } from "../../lib/date-range";
import { closeClient, ReservationsCollection_DEPRECATED, SalonsCollection_DEPRECATED, BookingSlotsCollection_DEPRECATED } from "../../db/mongodb";
import { Date as DateObject } from "../../types/date";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";
import { getBookingSlots } from "../../helpers/booking/get-booking-slots";
import { dateTimeToISODate } from "../../helpers/date/date-time-to-iso-date";
import { BookingSlot } from "../../types/booking-slot";
import { dateObjectToNativeDate } from "../../helpers/date/date-object-to-native-date";
import { dateToISODate } from "../../helpers/date/date-to-iso-date";

const debug = Debug("tasks:sync-booking-slots");

export async function syncBookingSlots(salonId: ObjectID, startDate: DateObject = null, endDate: DateObject = null) {
  const $salons = await SalonsCollection_DEPRECATED();
  const $bookingsSlots = await BookingSlotsCollection_DEPRECATED();
  const $reservations = await ReservationsCollection_DEPRECATED();
  const salon = await $salons.findOne({ _id: salonId });

  ok(salon, `Cannot find salon by id=${salonId.toHexString()}`);

  debug("parse salon timezone, %s", salon.timezone)
  const salonTimezone = findTimeZone(salon.timezone);

  debug("if startDate is empty, use local Date.now as start time")
  if (startDate == null) {
    const { year, month, day } = getZonedTime(new Date, salonTimezone);

    startDate = { year, month, day };
  }

  debug("if endDate is empty, use now + 30 days")
  if (endDate == null) {
    const { year, month, day } = getZonedTime(addDay(dateObjectToNativeDate(startDate), 30), salonTimezone);

    endDate = { year, month, day };
  }

  debug("get work hours from salon");
  const regularHours: BusinessHours = salon.regularHours || {
    periods: []
  };

  debug("get special hours from salon");
  const specialHours: SpecialHours = salon.specialHours || {
    periods: []
  };

  debug("extract service ID and duration values");
  const services = salon.services.items.map(v => ({
    id: v.id,
    duration: v.duration
  }))

  debug("get all reservations from current time period");
  const reservations: Reservation[] = await $reservations.find({
    salonId: salon._id,
    $and: [
      {
        "start.year": {
          $lte: endDate.year
        },
        "start.month": {
          $lte: endDate.month
        },
        "start.day": {
          $lte: endDate.day
        }
      },
      {
        "end.year": {
          $gte: startDate.year
        },
        "end.month": {
          $gte: startDate.month
        },
        "end.day": {
          $gte: startDate.day
        }
      }
    ],
  }).project({ masterId: 1, start: 1, end: 1 }).toArray();

  debug("get booking slots for current period: %s - %s", dateToISODate(startDate), dateToISODate(endDate));
  const slots = getBookingSlots({
    startPeriod: startDate,
    endPeriod: endDate,
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

  debug("each and add a enter slots")
  slots.forEach(v => {
    const key = `${v.userId}-${v.serviceId}-${dateTimeToISODate(v.start)}-${dateTimeToISODate(v.end)}`;

    if (bookingsSlotsMap.has(key)) {
      bookingsSlotsMap.delete(key);
    } else {
      enterBookingSlots.push({
        _version: "v1",
        salonId: salonId,
        userId: new ObjectID(v.userId),
        serviceId: v.serviceId,
        start: v.start,
        end: v.end,
        createdAt: new Date(),
      })
    }
  })

  const removeBookingSlots = Array.from(bookingsSlotsMap.values());

  debug(`insert a new slots(+${enterBookingSlots.length})`)
  if (enterBookingSlots.length > 0) {
    await $bookingsSlots.insertMany(enterBookingSlots);
  }

  debug(`delete not needed slots(-${removeBookingSlots.length})`)
  if (removeBookingSlots.length > 0) {
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
