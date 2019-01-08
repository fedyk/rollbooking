import Debug from "debug";
import { ObjectID } from "bson";
import { findTimeZone, getZonedTime, getUnixTime } from "timezone-support";
import { config } from "../../lib/config";
import { addDay } from "../../utils/date";
import { getBookingWorkdays } from "../../sagas/booking/get-booking-workdays";
import { BusinessHours, SpecialHours, Salon } from "../../models/salon";
import { Reservation } from "../../models/reservation";
import { DateRange } from "../../lib/date-range";
import { getEndDay } from "../../helpers/date/get-end-day";
import { BookingWorkdaysCollection, closeClient, ReservationsCollection, SalonsCollection } from "../../adapters/mongodb";
import { BookingWorkday } from "../../models/booking-workday";
import { Date as DateObject } from "../../models/date";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";

const debug = Debug("tasks:sync-booking-workdays");

export async function syncBookingWorkdays(salonsIds: ObjectID[] = null) {
  const $bookings = await BookingWorkdaysCollection()
  const $reservations = await ReservationsCollection()
  const $salons = await SalonsCollection();

  let salons: Salon[] = [];
 
  if (Array.isArray(salonsIds)) {
    salons = await $salons.find({
      _id: {
        $in: salonsIds
      }
    }).toArray()
  }
  else {
    salons = await $salons.find().toArray();
  }

  debug("fetch %s salons", salons.length);
  
  for (let i = 0; i < salons.length; i++) {
    const salon = salons[i];

    debug("get salon timezone")
    const salonTimezone = findTimeZone(salon.timezone);

    debug("convert local time to time in salon timezone")
    const salonNow = getZonedTime(new Date(), salonTimezone);

    const startPeriod: DateObject = {
      year: salonNow.year,
      month: salonNow.month,
      day: salonNow.day
    }

    const salonEndPeriod = getZonedTime(addDay(new Date(), 5), salonTimezone)

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

    const masters = salon.employees.users.map(v => ({
      id: v.id
    }))

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
    const reservation: Reservation[] = await $reservations.find({
      salon_id: salon._id.toHexString(),
      start: {
        $lt: endPeriod
      },
      end: {
        $gt: startPeriod
      },
    }).toArray();

    const reservations = reservation.map(v => ({
      range: new DateRange(dateTimeToNativeDate(v.start), dateTimeToNativeDate(v.end)),
      masterId: v.masterId.toHexString()
    }));

    const bookingWorkdays = getBookingWorkdays({
      startPeriod,
      endPeriod,
      regularHours,
      specialHours,
      masters,
      services,
      reservations
    });

    const BookingWorkdays: BookingWorkday[] = bookingWorkdays.map(v => {
      return Object.assign({
        salonId: salon._id,
        created: new Date(Date.now())
      }, v);
    })

    const { deletedCount } = await $bookings.deleteMany({
      salonId: salon._id
    })

    debug("deleted %s bookings for salon %s", deletedCount, salon._id);

    const { insertedCount } = await $bookings.insertMany(BookingWorkdays);

    debug("generate %s booking workdays for salon %s (id=%s)", insertedCount, salon.name, salon._id.toHexString());
  }
}

if (!module.parent) {
  (async function() {
    try {
      await syncBookingWorkdays();
      console.log("syncBookingWorkdays has finished")
    }
    catch(err) {
      console.log(err);
    }
    finally {
      closeClient()
    }
  })();
}
