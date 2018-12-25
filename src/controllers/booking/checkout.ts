import * as parseInt from "parse-int";
import { checkout as checkoutView } from "../../views/booking/checkout";
import { layout as layoutView } from "../../views/booking/layout";
import { connect } from "../../lib/database";
import { getSalonById } from "../../queries/salons";
import { Context } from "koa";
import { salonsBookingWorkdays, salonsReservations } from "../../adapters/mongodb";
import { getSalonService } from "../../sagas/get-salon-service";
import getUserName from "../../utils/get-user-name";
import { getServiceName, getServiceDuration } from "../../utils/service";
import { getUserById, getUserByEmail, createUser } from "../../queries/users";
import { timeInDay } from "../../helpers/date/time-in-day";
import { isEmail } from "../../utils/is-email";
import { User } from "../../models/user";
import { addMinutes } from "../../helpers/date/add-minutes";
import { stringify } from "querystring";
import { syncBookingWorkdays } from "../../tasks/salon/sync-booking-workdays";

export async function checkout(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId);
  const params = parseRequestQuery(ctx.query);
  const database = await connect();

  try {
    ctx.assert(salonId, 404, "Page doesn't exist")

    const salon = await getSalonById(database, salonId);
    const bookingWorkdaysCollections = await salonsBookingWorkdays();
    const reservationsCollections = await salonsReservations();
  
    ctx.assert(params.date, 400, "Invalid params");
  
    ctx.assert(params.masterId, 400, "Invalid params")
  
    ctx.assert(params.serviceId, 400, "Invalid params")
  
    const salonMaster = await getUserById(database, params.masterId);
  
    ctx.assert(salonMaster, 400, "Invalid params");
  
    const salonService = await getSalonService(database, salonId, params.serviceId);
  
    ctx.assert(salonService, 400, "Invalid params");
  
    const bookingWorkday = await bookingWorkdaysCollections.findOne({
      "period.startDate.year": {
        $lte: params.date.getFullYear()
      },
      "period.startDate.month": {
        $lte: params.date.getMonth() + 1,
      },
      "period.startDate.day": {
        $lte: params.date.getDate()
      },
      "period.endDate.year": {
        $gte: params.date.getFullYear()
      },
      "period.endDate.month": {
        $gte: params.date.getMonth() + 1,
      },
      "period.endDate.day": {
        $gte: params.date.getDate()
      },
    });
  
    ctx.assert(bookingWorkday, 400, "Time is not available anymore")

    const bookingWorkdayMaster = bookingWorkday.masters[params.masterId.toString()];
    ctx.assert(bookingWorkdayMaster, 400, "Barber has no slots for this date")

    const bookingWorkdayService = bookingWorkdayMaster.services[params.serviceId.toString()];
    ctx.assert(bookingWorkdayService, 400, "Barber not doing this service at this date")

    const availableTimes = bookingWorkdayService.available_times;
    const requestedTime = timeInDay(params.date);

    ctx.assert(availableTimes && availableTimes.length > 0, 400, "All time is booked")
    ctx.assert(availableTimes.indexOf(requestedTime) !== -1, 400, "This time is booked")

    // Ok, lets save
    if (ctx.method === "POST") {
      const userParams = parseRequestBody(ctx.request.body);

      ctx.assert(isEmail(userParams.email), 400, "Invalid email")
      ctx.assert(userParams.fullName, 400, "Name is required")
      ctx.assert(userParams.fullName.length < 64, 400, "Name is too long")
      
      let user: User = await getUserByEmail(database, userParams.email);

      if (!user) {
        user = await createUser(database, {
          email: userParams.email,
          properties: {
            general: {
              name: userParams.fullName,
            }
          },
          password: "",
          logins: 1,
          last_login: null,
          created: new Date(),
          updated: new Date()
        })

        await ctx.login(user);
      }

      const reservation = await reservationsCollections.insertOne({
        salon_id: salonId,
        user_id: user.id,
        master_id: salonMaster.id,
        service_id: salonService.id,
        start: params.date,
        end: addMinutes(params.date, getServiceDuration(salonService)),
        status: 2, // confirmed
      })

      ctx.assert(reservation.insertedCount === 1, 500, "Internal error")

      await syncBookingWorkdays(database, [salon.id]);

      ctx.redirect(`/booking/${salonId}/reservation?${stringify({
        id: reservation.insertedId.toHexString()
      })}`);
    }

    ctx.body = layoutView({
      title: "Test Salon",
      body: checkoutView({
        salonName: salon.name,
        bookingMasterName: getUserName(salonMaster),
        bookingServiceName: getServiceName(salonService),
        bookingDate: params.date.toISOString(),
      })
    })
  }
  catch(e) {
    throw e;
  }
  finally {
    database.release();
  }
}

/**
 * @source https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
 */
const ISO_DATE_TIME = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/

export function parseRequestQuery(query: any): {
  masterId: number;
  serviceId: number;
  date: Date;
} {
  const masterIdStr = query && query.master_id || query.m;
  const serviceIdStr = query && query.service_id || query.s;
  const dateStr = (query && query.date || query.d) + '';
  let date = null;

  if (ISO_DATE_TIME.test(dateStr)) {
    date = new Date(dateStr);
  }

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? date : null,
    masterId: parseInt(masterIdStr) || null,
    serviceId: parseInt(serviceIdStr) || null,
  }
}

export function parseRequestBody(body: any) {
  const email: string = body && body.email || '';
  const fullName: string = body && body.full_name || ''

  return {
    email,
    fullName
  }
}
