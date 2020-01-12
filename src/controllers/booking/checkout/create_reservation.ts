import { Context } from "koa";
import { ObjectID } from "bson";
import { stringify, ParsedUrlQueryInput } from "querystring";
import { isEmail } from "../../../utils/is-email";
import { Salon } from "../../../core/types/salon";
import { User } from "../../../core/types/user";
import { Client } from "../../../core/types/client";
import { SessionPayload } from "../../../core/types/session";
import { parseCheckoutRequestBody } from "../helpers/parse-checkout-request-body";
import { syncBookingSlots } from "../../../tasks_DEPRECATED/salon/sync-booking-slots";
import { ReservationsCollection_DEPRECATED, UsersCollection_DEPRECATED, ClientsCollection_DEPRECATED, BookingSlotsCollection_DEPRECATED } from "../../../core/db/mongodb";
import { ReservationURLParams } from "../interfaces";
import { CheckoutContext } from "../middlewares/checkout-middleware";

export async function createReservation(ctx: CheckoutContext, next) {
  const session = ctx.session as SessionPayload;
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const isAuthenticated = ctx.isAuthenticated();
  const bookingSlot = ctx.state.bookingSlot;
  const salonMaster = ctx.state.salonMaster;
  const salonService = ctx.state.salonService;

  ctx.assert(bookingSlot, 404, "Time is already booked");
  ctx.assert(salonMaster, 404, "Oops, something went wrong");
  ctx.assert(salonService, 400, "Invalid params");

  const $clients = await ClientsCollection_DEPRECATED();
  

  let client: Client;

  if (!isAuthenticated) {
    const clientId = ctx.session.clientId;

    if (ObjectID.isValid(clientId)) {
      client = await $clients.findOne({
        _id: new ObjectID(clientId)
      });
    }

    if (!client) {
      const { email, name } = parseCheckoutRequestBody(ctx.request.body);

      ctx.assert(isEmail(email), 400, "Invalid email");
      ctx.assert(name, 400, "Name is required");
      ctx.assert(name.length < 64, 400, "Name is too long");

      const { ops: [
        insertedClient
      ] } = await $clients.insertOne({
        _version: "v1",
        salonId: salon._id,
        userId: null,
        email: email,
        name: name,
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
        _version: "v1",
        salonId: salon._id,
        userId: user._id,
        email: user.email,
        name: user.name,
        created: new Date()
      });

      client = insertedClient;
    }
  }

  // Save user input for next time
  session.clientName = client.name;
  session.clientEmail = client.email;
  session.clientId = client._id.toHexString();

  const $reservations = await ReservationsCollection_DEPRECATED();
  const reservation = await $reservations.insertOne({
    salonId: salon._id,
    clientId: client._id,
    masterId: salonMaster._id,
    serviceId: salonService.id,
    start: bookingSlot.start,
    end: bookingSlot.end,
    status: 2, // confirmed
    createdAt: new Date(),
    updatedAt: new Date()
  })

  ctx.assert(reservation.insertedCount === 1, 500, "Internal error: Cannot create reservation");

  const $bookingSlots = await BookingSlotsCollection_DEPRECATED();

  await $bookingSlots.deleteOne({
    _id: bookingSlot._id
  })

  const query: ReservationURLParams & ParsedUrlQueryInput = {
    rid: reservation.insertedId.toHexString()
  }

  ctx.redirect(`/${salon.alias}/booking/reservation?${stringify(query)}`);
}


