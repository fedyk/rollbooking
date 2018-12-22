import "../../lib/config";
import Debug from "debug";
import { addDay } from "../../utils/date";
import { getSalonsList } from "../../queries/salons";
import { connect, end } from "../../lib/database";
import { getBookingWorkdays } from "../../sagas/booking/get-booking-workdays";
import { BusinessHours, SpecialHours } from "../../models/salon";
import { getSalonUsers } from "../../sagas/get-salon-users";
import { getSalonServices } from "../../sagas/get-salon-services";
import { getServiceDuration } from "../../utils/service";
import { SalonReservation } from "../../models/salon-reservation";
import { DateRange } from "../../lib/date-range";
import { dateToISODate } from "../../helpers/booking-workday/date-to-iso-date";
import { DayOfWeek } from "../../models/dat-of-week";
import { getStartDay } from "../../helpers/date/get-start-day";
import { getEndDay } from "../../helpers/date/get-end-day";

const debug = Debug("tasks:sync-booking-workdays");

export async function syncBookingWorkdays() {
  const startPeriod = getStartDay(new Date(Date.now()));
  const endPeriod = getEndDay(addDay(startPeriod, 60));
  const database = await connect()
  const salons = await getSalonsList(database);

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

    const salonReservation: SalonReservation[] = []
    const reservations = salonReservation.map(v => {
      const startDate = `${dateToISODate(v.start_date)}T${v.start_time}:00.00Z`;
      const endDate = `${dateToISODate(v.end_date)}T${v.end_time}:00.00Z`;

      return {
        range: new DateRange(startDate, endDate),
        master_id: v.master_id
      }
    });

    const bookingWorkdays = getBookingWorkdays({
      startPeriod,
      endPeriod,
      regularHours,
      specialHours,
      masters,
      services,
      reservations
    })

    debug("generate booking workdays for salon %s(id=%s)", salon.name, salon.id);
    // debug("regular hours %s", JSON.stringify(regularHours, null, 2));
    // debug("booking workdays %s", JSON.stringify(bookingWorkdays, null, 2));
    // debug("salon masters %s", JSON.stringify(salonMasters, null, 2));
    // debug("salon services %s", JSON.stringify(salonServices, null, 2));
  }

  await database.release();
  await end();
}


if (!module.parent) {
  syncBookingWorkdays().then(function() {
    console.log("syncBookingWorkdays has finished")
  }).catch(function(err) {
    console.error(err);    
  })
}
