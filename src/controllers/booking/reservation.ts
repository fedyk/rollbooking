import { bookingLayoutView } from "../../views/booking/booking-layout-view";
import { Context } from "koa";
import { ReservationsCollection, SalonsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";

export async function reservation(ctx: Context) {
  const salonId = ctx.params.salonId as string;
  const reservationId = ctx.query.id as string;
  const $salons = await SalonsCollection();
  const $reservations = await ReservationsCollection();

  ctx.assert(ObjectID.isValid(salonId), 404, "Page doesn't exist");
  ctx.assert(ObjectID.isValid(reservationId), 404, "Page doesn't exist");

  const salon = await $salons.findOne({
    _id: new ObjectID(salonId)
  })

  ctx.assert(salon, 404, "Page doesn't exist");

  const reservation = await $reservations.findOne({
    _id: new ObjectID(reservationId)
  })

  ctx.assert(reservation, 404, "Reservation doesn't exist")

  ctx.body = bookingLayoutView({
    salonId: salon._id.toHexString(),
    salonName: salon.name,
    body: `<pre>${JSON.stringify(reservation, null, 2)}</pre>`
  })
}
