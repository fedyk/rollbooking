import * as parseInt from "parse-int";
import { checkout as checkoutView } from "../../views/booking/checkout";
import { layout as layoutView } from "../../views/booking/layout";
import { Context } from "koa";
import { BookingWorkdaysCollection, ReservationsCollection, UsersCollection, SalonsCollection } from "../../adapters/mongodb";
import getUserName from "../../utils/get-user-name";
import { isEmail } from "../../utils/is-email";
import { User } from "../../models/user";
import { addMinutes } from "../../helpers/date/add-minutes";
import { stringify } from "querystring";
import { syncBookingWorkdays } from "../../tasks/salon/sync-booking-workdays";
import { ObjectID } from "bson";
import { nativeDateToDateTime } from "../../helpers/date/native-date-to-date-time";
import { nativeDateToTime } from "../../helpers/date/native-date-to-time";

export async function checkout(ctx: Context) {
  const salonId = ctx.params.salonId as string;
  const params = parseRequestQuery(ctx.query);

  try {
    ctx.assert(salonId, 404, "Page doesn't exist")
    ctx.assert(ObjectID.isValid(salonId), 404, "Page doesn't exist")

    const $salons = await SalonsCollection();
    const $bookingWorkdays = await BookingWorkdaysCollection();
    const $users = await UsersCollection();
    const $reservations = await ReservationsCollection();

    const salon = await $salons.findOne({
      _id: new ObjectID(salonId)
    })
  
    ctx.assert(params.date, 400, "Invalid params");
    ctx.assert(params.masterId, 400, "Invalid params")
    ctx.assert(params.serviceId, 400, "Invalid params")

    const salonMaster = await $users.findOne({
      _id: new ObjectID(params.masterId)
    });
  
    ctx.assert(salonMaster, 400, "Invalid params");
  
    const salonService = salon.services.items.find(v => v.id === params.serviceId);
  
    ctx.assert(salonService, 400, "Invalid params");
  
    // TODO: this should be covered by TS, any changes and we would know about need to update this part
    const bookingWorkday = await $bookingWorkdays.findOne({
      "period.start.year": {
        $lte: params.date.getFullYear()
      },
      "period.start.month": {
        $lte: params.date.getMonth() + 1,
      },
      "period.start.day": {
        $lte: params.date.getDate()
      },
      "period.endDate.year": {
        $gt: params.date.getFullYear()
      },
      "period.endDate.month": {
        $gt: params.date.getMonth() + 1,
      },
      "period.endDate.day": {
        $gt: params.date.getDate()
      },
    });
  
    ctx.assert(bookingWorkday, 400, "Time is not available anymore")

    const bookingWorkdayMaster = bookingWorkday.masters[params.masterId.toString()];
    ctx.assert(bookingWorkdayMaster, 400, "Barber has no slots for this date")

    const bookingWorkdayService = bookingWorkdayMaster.services[params.serviceId.toString()];
    ctx.assert(bookingWorkdayService, 400, "Barber not doing this service at this date")

    const availableTimes = bookingWorkdayService.availableTimes;
    const time = nativeDateToTime(params.date)
    const requestedTime = availableTimes.find(v => v === time);

    ctx.assert(availableTimes && availableTimes.length > 0, 400, "All time is booked")
    ctx.assert(requestedTime, 400, "The selected time is already booked")

    // Ok, lets save
    if (ctx.method === "POST") {
      const userParams = parseRequestBody(ctx.request.body);

      ctx.assert(isEmail(userParams.email), 400, "Invalid email")
      ctx.assert(userParams.fullName, 400, "Name is required")
      ctx.assert(userParams.fullName.length < 64, 400, "Name is too long")
      
      let user: User = await $users.findOne({
        email: userParams.email
      });

      if (!user) {
        user = {
          email: userParams.email,
          name: userParams.fullName,
          password: "",
          created: new Date(),
          updated: new Date(),
          employers: {
            salons: []
          },
          properties: {}
        }
        const insertResult = await $users.insertOne(user);

        user._id = insertResult.insertedId;

        await ctx.login(user);
      }

      const reservation = await $reservations.insertOne({
        salonId: salon._id,
        userId: user._id,
        masterId: salonMaster._id,
        serviceId: salonService.id,
        start: nativeDateToDateTime(params.date),
        end: nativeDateToDateTime(addMinutes(params.date, salonService.duration)),
        status: 2, // confirmed
      })

      ctx.assert(reservation.insertedCount === 1, 500, "Internal error")

      await syncBookingWorkdays([salon._id]);

      ctx.redirect(`/booking/${salonId}/reservation?${stringify({
        id: reservation.insertedId.toHexString()
      })}`);
    }

    ctx.body = layoutView({
      title: "Test Salon",
      body: checkoutView({
        salonName: salon.name,
        bookingMasterName: getUserName(salonMaster),
        bookingServiceName: salonService.name,
        bookingDate: params.date.toISOString(),
      })
    })
  }
  catch(e) {
    throw e;
  }
  finally {
    
  }
}

/**
 * @source https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
 */
const ISO_DATE_TIME = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/

export function parseRequestQuery(query: any): {
  masterId: string;
  serviceId: number;
  date: Date;
} {
  const masterIdStr = query && query.master_id || query.m;
  const serviceIdStr = query && query.service_id || query.s;
  const dateStr = `${query && query.date || query.d || ''}`.trim();
  let date;
  
  if (ISO_DATE_TIME.test(dateStr)) {
    date = new Date(dateStr);
  }

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? date : null,
    masterId: ObjectID.isValid(masterIdStr) ? masterIdStr : null,
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
