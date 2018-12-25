import "../../lib/config";
import Debug from "debug";
import { addDay } from "../../utils/date";
import { getSalonsList, getSalonById } from "../../queries/salons";
import { connect, end } from "../../lib/database";
import { getBookingWorkdays } from "../../sagas/booking/get-booking-workdays";
import { BusinessHours, SpecialHours, Salon } from "../../models/salon";
import { getSalonUsers } from "../../sagas/get-salon-users";
import { getSalonServices } from "../../sagas/get-salon-services";
import { getServiceDuration } from "../../utils/service";
import { SalonReservation } from "../../models/salon-reservation";
import { DateRange } from "../../lib/date-range";
import { dateToISODate } from "../../helpers/booking-workday/date-to-iso-date";
import { DayOfWeek } from "../../models/dat-of-week";
import { getStartDay } from "../../helpers/date/get-start-day";
import { getEndDay } from "../../helpers/date/get-end-day";
import { salonsBookingWorkdays, closeClient, salonsReservations } from "../../adapters/mongodb";
import { SalonBookingWorkday } from "../../models/salon-booking-workday";
import { PoolClient } from "pg";

const debug = Debug("tasks:sync-booking-workdays");

export async function syncBookingWorkdays(database: PoolClient, salonsIds: number[] = null) {
  const startPeriod = getStartDay(new Date(Date.now()));
  const endPeriod = getEndDay(addDay(startPeriod, 20));
  const collection = await salonsBookingWorkdays()
  const $salonsReservations = await salonsReservations()
  let salons: Salon[] = [];

  if (Array.isArray(salonsIds)) {
    salons = await Promise.all(salonsIds.map(salonId => getSalonById(database, salonId)));
  }
  else {
    salons = await getSalonsList(database);
  }

  debug("fetch %s salons", salons.length);
  
  for (let i = 0; i < salons.length; i++) {
    const salon = salons[i];

    const regularHours: BusinessHours = salon.regular_hours || {
      periods: [{
        openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
        openTime: "10:00",
        closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
        closeTime: "18:00"
      }]
    };

    const specialHours: SpecialHours = {
      periods: []
    };

    const salonMasters = await getSalonUsers(database, salon.id);
    const masters = salonMasters.map(v => ({
      id: v.user_id
    }));

    const salonServices = await getSalonServices(database, salon.id);
    const services = salonServices.map(v => ({
      id: v.id,
      duration: getServiceDuration(v)
    }))

    /**
     *     reserv1    reserv2
     * ---|-------|--|-------|---
     *      | <- start   | <- end
     * -----|------------|-------
     * 
     */  
    const salonReservation: SalonReservation[] = await $salonsReservations.find({
      salon_id: salon.id,
      start: {
        $lt: endPeriod
      },
      end: {
        $gt: startPeriod
      },
    }).toArray();

    const reservations = salonReservation.map(v => ({
      range: new DateRange(v.start, v.end),
      master_id: v.master_id
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
        salon_id: salon.id,
        created: new Date(Date.now())
      }, v);
    })

    await collection.deleteMany({
      salon_id: salon.id
    })

    await collection.insertMany(salonBookingWorkdays);

    debug("generate booking workdays for salon %s (id=%s)", salon.name, salon.id);
  }
}

if (!module.parent) {
  (async function() {
    const database = await connect();

    try {
      await syncBookingWorkdays(database);
      console.log("syncBookingWorkdays has finished")
    }
    catch(err) {
      console.log(err);
    }
    finally {
      await database.release();
      closeClient()
      end();
    }
  })();
}
