import { bookingLayoutView } from "../../views/booking/booking-layout-view";
import { Context } from "koa";
import { ReservationsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";
import { Salon } from "../../models/salon";

export async function reservation(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const reservationId = ctx.query.id as string;
  const $reservations = await ReservationsCollection();

  ctx.assert(ObjectID.isValid(reservationId), 404, "Page doesn't exist");

  const reservation = await $reservations.findOne({
    salonId: salon._id,
    _id: new ObjectID(reservationId)
  })

  ctx.assert(reservation, 404, "Reservation doesn't exist")

  ctx.body = bookingLayoutView({
    salonAlias: salon.alias,
    salonName: salon.name,
    body: `<pre>${JSON.stringify(reservation, null, 2)}</pre>`
  })
}
