import { Context } from "koa";
import { ObjectID } from "bson";
import * as parseInt from "parse-int";
import { stringify } from "querystring";
import { checkout as checkoutView } from "../../views/booking/checkout";
import { layout as layoutView } from "../../views/booking/layout";
import { BookingWorkdaysCollection, ReservationsCollection, UsersCollection, SalonsCollection } from "../../adapters/mongodb";
import getUserName from "../../utils/get-user-name";
import { isEmail } from "../../utils/is-email";
import { User } from "../../models/user";
import { addMinutes } from "../../helpers/date/add-minutes";
import { syncBookingWorkdays } from "../../tasks/salon/sync-booking-workdays";
import { nativeDateToDateTime } from "../../helpers/date/native-date-to-date-time";
import { nativeDateToTime } from "../../helpers/date/native-date-to-time";
import { CheckoutURLParams } from "./interfaces";
import { DateTime } from "../../models/date-time";
import { TimeOfDay } from "../../models/time-of-day";
import { isoDateTimeToDateTime } from "../../helpers/date/iso-date-time-to-date-time";
import { isoTimeToTimeOfDay } from "../../helpers/date/iso-time-to-time-of-day";
import { FilterQuery } from "mongodb";
import { BookingWorkday } from "../../models/booking-workday";
import { Date as DateObject } from "../../models/date";
import { isoDateToDateObject } from "../../helpers/date/iso-date-to-date-object";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";

export async function checkout(ctx: Context) {
  const salonId = ctx.params.salonId as string;
  const params = parseRequestQuery(ctx.query);

    ctx.assert(salonId, 404, "Page doesn't exist")
    ctx.assert(ObjectID.isValid(salonId), 404, "Page doesn't exist")

    const $salons = await SalonsCollection();
    const $bookingWorkdays = await BookingWorkdaysCollection();
    const $users = await UsersCollection();
    const $reservations = await ReservationsCollection();

    const salon = await $salons.findOne({
      _id: new ObjectID(salonId)
    })
  
    ctx.assert(params.masterId, 400, "Invalid params")
    ctx.assert(params.serviceId, 400, "Invalid params")
    ctx.assert(params.startPeriod, 400, "Invalid params")
    ctx.assert(params.endPeriod, 400, "Invalid params")
    ctx.assert(params.time, 400, "Invalid params")
    ctx.assert(params.date, 400, "Invalid params")

    const salonMaster = await $users.findOne({
      _id: new ObjectID(params.masterId)
    });
  
    ctx.assert(salonMaster, 400, "Invalid params");
  
    const salonService = salon.services.items.find(v => v.id === params.serviceId);
  
    ctx.assert(salonService, 400, "Invalid params");
  
    // TODO: this should be covered by TS, any changes and we would know about need to update this part
    const bookingWorkday = await $bookingWorkdays.findOne(
      byWorkdayPeriod(params.startPeriod, params.endPeriod)
    );
  
    ctx.assert(bookingWorkday, 400, "Time is not available anymore")

    const bookingWorkdayMaster = bookingWorkday.masters[params.masterId];

    ctx.assert(bookingWorkdayMaster, 400, "Master has no slots for this date")

    const bookingWorkdayService = bookingWorkdayMaster.services[params.serviceId.toString()];

    ctx.assert(bookingWorkdayService, 400, "Barber not doing this service at this date")

    const availableTimes = bookingWorkdayService.availableTimes;
    const requestedTime = availableTimes.find(v => v.hours === params.time.hours &&
      v.minutes === params.time.minutes &&
      v.seconds === params.time.seconds
    );

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

      const reservationStart = {
        year: params.date.year,
        month: params.date.month,
        day: params.date.day,
        hours: requestedTime.hours,
        minutes: requestedTime.minutes,
        seconds: requestedTime.seconds,
      }

      const reservation = await $reservations.insertOne({
        salonId: salon._id,
        userId: user._id,
        masterId: salonMaster._id,
        serviceId: salonService.id,
        start: reservationStart,
        end: nativeDateToDateTime(
          addMinutes(dateTimeToNativeDate(reservationStart), salonService.duration)
        ),
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
        bookingDate: dateTimeToNativeDate({
          year: params.date.year,
          month: params.date.month,
          day: params.date.day,
          hours: requestedTime.hours,
          minutes: requestedTime.minutes,
          seconds: requestedTime.seconds,
        }).toLocaleString()
      })
    })
}

export function parseRequestQuery(query: Partial<CheckoutURLParams>): {
  masterId: string;
  serviceId: number;
  startPeriod: DateTime;
  endPeriod: DateTime;
  time: TimeOfDay;
  date: DateObject
} {
  const masterId = query && query.m && ObjectID.isValid(query.m) && query.m || null;
  const serviceId = query && query.s && parseInt(query.s) || null;
  const startPeriod = query && query.wdps && isoDateTimeToDateTime(query.wdps) || null;
  const endPeriod = query && query.wdpe && isoDateTimeToDateTime(query.wdpe) || null;
  const time = query && query.t && isoTimeToTimeOfDay(query.t) || null;
  const date = query && query.d && isoDateToDateObject(query.d) || null;

  return {
    masterId,
    serviceId,
    startPeriod,
    endPeriod,
    time,
    date
  };
}

export function parseRequestBody(body: any) {
  const email: string = body && body.email || '';
  const fullName: string = body && body.full_name || ''

  return {
    email,
    fullName
  }
}


function byWorkdayPeriod(start: DateTime, end: DateTime): FilterQuery<BookingWorkday> {
  return {
    "period.start.year": start.year,
    "period.start.month": start.month,
    "period.start.day": start.day,
    "period.start.hours": start.hours,
    "period.start.minutes": start.minutes,
    "period.start.seconds": start.seconds,
    "period.end.year": end.year,
    "period.end.month": end.month,
    "period.end.day": end.day,
    "period.end.hours": end.hours,
    "period.end.minutes": end.minutes,
    "period.end.seconds": end.seconds
  }
}
