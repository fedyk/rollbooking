import { Context } from "koa";
import { ObjectID } from "bson";
import { stringify } from "querystring";
import { checkoutView } from "../../../views/booking/checkout-view";
import { bookingLayoutView } from "../../../views/booking/booking-layout-view";
import { BookingWorkdaysCollection, ReservationsCollection, UsersCollection, ClientsCollection } from "../../../adapters/mongodb";
import { isEmail } from "../../../utils/is-email";
import { addMinutes } from "../../../helpers/date/add-minutes";
import { syncBookingWorkdays } from "../../../tasks/salon/sync-booking-workdays";
import { nativeDateToDateTime } from "../../../helpers/date/native-date-to-date-time";
import { DateTime } from "../../../models/date-time";
import { FilterQuery } from "mongodb";
import { BookingWorkday } from "../../../models/booking-workday";
import { dateTimeToNativeDate } from "../../../helpers/date/date-time-to-native-date";
import { Salon } from "../../../models/salon";
import { User } from "../../../models/user";
import { Client } from "../../../models/client";
import { SessionPayload } from "../../../models/session";
import { parseCheckoutRequestQuery } from "../helpers/parse-checkout-request-query";
import { parseCheckoutRequestBody } from "../helpers/parse-checkout-request-body";
import { toDottedObject } from "../../../helpers/to-dotted-object";

export async function post(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const isAuthenticated = ctx.isAuthenticated();
  const params = parseCheckoutRequestQuery(ctx.query);
  const $bookingWorkdays = await BookingWorkdaysCollection();
  const $users = await UsersCollection();
  const $clients = await ClientsCollection();
  const $reservations = await ReservationsCollection();
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

  // Ok, lets save
  if (ctx.method === "POST") {
    const clientParams = parseCheckoutRequestBody(ctx.request.body);
    let client: Client; 

    // Validate data from unAuthenticated client
    if (!isAuthenticated) {
      ctx.assert(isEmail(clientParams.email), 400, "Invalid email");
      ctx.assert(clientParams.name, 400, "Name is required");
      ctx.assert(clientParams.name.length < 64, 400, "Name is too long");

      const clientId = ctx.session.clientId;

      if (ObjectID.isValid(clientId)) {
        client = await $clients.findOne({ _id: new ObjectID(clientId) });
      }

      if (!client) {
        const { ops: [insertedClient] } = await $clients.insertOne({
          userId: null,
          email: clientParams.email,
          name: clientParams.name,
          created: new Date(),
          updated: new Date(),
        });

        if (insertedClient) {
          client = insertedClient;
        }
        else {
          ctx.throw(500, "Cannot create a clients");
        }
      }
    }
    else {
      client = await $clients.findOne({ userId: user._id });

      if (!client) {
        const { ops: [insertedClient] } = await $clients.insertOne({
          userId: user._id,
          email: user.email,
          name: user.name,
          created: new Date(),
          updated: new Date(),
        });

        client = insertedClient;
      }
    }

    // Save user input for next time
    session.clientName = client.name;
    session.clientEmail = client.email;
    session.clientId = client._id.toHexString();

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
      clientId: client._id,
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
