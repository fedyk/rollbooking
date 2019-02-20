import { Context } from "koa";
import { ObjectID } from "bson";
import { checkoutView } from "../../../views/booking/checkout-view";
import { bookingLayoutView } from "../../../views/booking/booking-layout-view";
import { BookingWorkdaysCollection, UsersCollection } from "../../../adapters/mongodb";
import { BookingWorkday } from "../../../models/booking-workday";
import { dateTimeToNativeDate } from "../../../helpers/date/date-time-to-native-date";
import { Salon } from "../../../models/salon";
import { User } from "../../../models/user";
import { SessionPayload } from "../../../models/session";
import { parseCheckoutRequestQuery } from "../helpers/parse-checkout-request-query";
import { toDottedObject } from "../../../helpers/to-dotted-object";

export async function get(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const isAuthenticated = ctx.isAuthenticated();
  const params = parseCheckoutRequestQuery(ctx.query);
  const $bookingWorkdays = await BookingWorkdaysCollection();
  const $users = await UsersCollection();
  const session = ctx.session as SessionPayload;
  const userName = isAuthenticated ? (user.name) : session.clientName;
  const userEmail = isAuthenticated ? user.email : session.clientEmail;

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

  const filter: Partial<BookingWorkday> = {
    salonId: salon._id,
    period: {
      start: params.startPeriod,
      end: params.endPeriod,
    }
  }

  const bookingWorkday = await $bookingWorkdays.findOne(toDottedObject(filter));

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

  ctx.body = bookingLayoutView({
    salonName: salon.name,
    salonAlias: salon.alias,
    body: checkoutView({
      isAuthenticated: isAuthenticated,
      userName: userName,
      userEmail: userEmail,
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
