import { Context } from "koa";
import { ObjectID } from "bson";
import { ReservationURLParams } from "../interfaces";
import { Salon } from "../../../models/salon";
import { ReservationsCollection } from "../../../adapters/mongodb";
import { reservationView } from "./reservation-view";

export async function reservation(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const params = parseQueryParams(ctx.query);

  ctx.assert(params.reservationId, 404, "Reservation does not exist");

  const $reservations = await ReservationsCollection();

  const reservation = await $reservations.findOne({
    salonId: salon._id,
    _id: new ObjectID(params.reservationId)
  })

  ctx.assert(reservation, 404, "Reservation doesn't exist")

  ctx.body = reservationView({
    salon,
    reservation
  });
}

function parseQueryParams(query?: ReservationURLParams) {
  const reservationId = query ? query.rid : "";

  return {
    reservationId: ObjectID.isValid(reservationId) ? new ObjectID(reservationId) : null
  }
}
