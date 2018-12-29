import "../../lib/config";
import Debug from "debug";
import { ObjectID } from "bson";
import { addDay } from "../../utils/date";
import { getBookingWorkdays } from "../../sagas/booking/get-booking-workdays";
import { BusinessHours, SpecialHours, Salon } from "../../models/salon";
import { Reservation } from "../../models/reservation";
import { DateRange } from "../../lib/date-range";
import { getStartDay } from "../../helpers/date/get-start-day";
import { getEndDay } from "../../helpers/date/get-end-day";
import { BookingWorkdaysCollection, closeClient, ReservationsCollection, SalonsCollection } from "../../adapters/mongodb";
import { SalonBookingWorkday } from "../../models/salon-booking-workday";


const debug = Debug("tasks:sync-booking-workdays");

export async function syncBookingWorkdays(salonsIds: ObjectID[] = null) {
  const startPeriod = getStartDay(new Date(Date.now()));
  const endPeriod = getEndDay(addDay(startPeriod, 20));
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
      range: new DateRange(v.start, v.end),
      masterId: v.masterId
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

    const salonBookingWorkdays: SalonBookingWorkday[] = bookingWorkdays.map(v => {
      return Object.assign({
        salonId: salon._id,
        created: new Date(Date.now())
      }, v);
    })

    await $reservations.deleteMany({
      salonId: salon._id
    })

    await $bookings.insertMany(salonBookingWorkdays);

    debug("generate booking workdays for salon %s (id=%s)", salon.name, salon._id.toHexString());
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
