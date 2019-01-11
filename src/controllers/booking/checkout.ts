import { Context } from "koa";
import { ObjectID } from "bson";
import * as parseInt from "parse-int";
import { stringify } from "querystring";
import { checkoutView } from "../../views/booking/checkout-view";
import { bookingLayoutView } from "../../views/booking/booking-layout-view";
import { BookingWorkdaysCollection, ReservationsCollection, UsersCollection, SalonsCollection } from "../../adapters/mongodb";
import { isEmail } from "../../utils/is-email";
import { addMinutes } from "../../helpers/date/add-minutes";
import { syncBookingWorkdays } from "../../tasks/salon/sync-booking-workdays";
import { nativeDateToDateTime } from "../../helpers/date/native-date-to-date-time";
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
import { Salon } from "../../models/salon";

export async function checkout(ctx: Context) {
  const salon = ctx.state.salon as Salon;  
  const params = parseRequestQuery(ctx.query);
  const $bookingWorkdays = await BookingWorkdaysCollection();
  const $users = await UsersCollection();
  const $reservations = await ReservationsCollection();

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
    byWorkdayPeriod(salon._id, params.startPeriod, params.endPeriod)
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
    ctx.assert(userParams.name, 400, "Name is required")
    ctx.assert(userParams.name.length < 64, 400, "Name is too long")

    let user = await $users.findOne({
      email: userParams.email
    });

    if (!user) {
      user = {
        email: userParams.email,
        name: userParams.name,
        password: "",
        created: new Date(),
        updated: new Date(),
        employers: {
          salons: []
        },
        properties: {}
      }

      const { insertedId } = await $users.insertOne(user);

      user._id = insertedId;
    }

    // Save user input for next time
    ctx.session.bookingUserName = userParams.name;
    ctx.session.bookingUserEmail = userParams.email;

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

    ctx.redirect(`/${salon.alias}/booking/reservation?${stringify({
      id: reservation.insertedId.toHexString()
    })}`);
  }

  ctx.body = bookingLayoutView({
    salonName: salon.name,
    salonAlias: salon.alias,
    body: checkoutView({
      userEmail: ctx.session.bookingUserEmail || "",
      userName: ctx.session.bookingUserName || "",
      bookingMasterName: salonMaster.name,
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
  const email: string = body && body.email || "";
  const name: string = body && body.name || ""

  return {
    email,
    name
  }
}


function byWorkdayPeriod(salonId: ObjectID, start: DateTime, end: DateTime): FilterQuery<BookingWorkday> {
  return {
    salonId: salonId,
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
