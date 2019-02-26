import { Context } from "koa";
import { ObjectID } from "bson";
import { stringify } from "querystring";
import { isEmail } from "../../../utils/is-email";
import { Salon } from "../../../models/salon";
import { User } from "../../../models/user";
import { Client } from "../../../models/client";
import { SessionPayload } from "../../../models/session";
import { parseCheckoutRequestQuery } from "../helpers/parse-checkout-request-query";
import { parseCheckoutRequestBody } from "../helpers/parse-checkout-request-body";
import { syncBookingSlots } from "../../../tasks/salon/sync-booking-slots";
import { ReservationsCollection, UsersCollection, ClientsCollection, BookingSlotsCollection } from "../../../adapters/mongodb";
import { ReservationURLParams } from "../interfaces";

export interface CreateReservationResponse {
  error?: string;
  redirectUrl?: string;
}

export async function createReservation(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const isAuthenticated = ctx.isAuthenticated();
  const params = parseCheckoutRequestQuery(ctx.query);
  const $users = await UsersCollection();
  const $clients = await ClientsCollection();
  const $reservations = await ReservationsCollection();
  const session = ctx.session as SessionPayload;
  const $bookingSlots = await BookingSlotsCollection();

  ctx.assert(params.slotId, 404, "Page does not exist");

  const bookingSlot = await $bookingSlots.findOne({ _id: params.slotId });

  ctx.assert(bookingSlot, 404, "Time is already booked");

  const salonMaster = await $users.findOne({ _id: bookingSlot.userId });

  ctx.assert(salonMaster, 404, "Oops, something went wrong");

  const salonService = salon.services.items.find(v => v.id === bookingSlot.serviceId);

  ctx.assert(salonService, 400, "Invalid params");

  // Ok, lets save
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

  ctx.assert(reservation.insertedCount === 1, 500, "Internal error")

  await syncBookingSlots(salon._id);

  const redirectUrl = `/${salon.alias}/booking/reservation?${stringify({ rid: reservation.insertedId.toHexString() } as ReservationURLParams)}`

  ctx.redirect(redirectUrl);
}


