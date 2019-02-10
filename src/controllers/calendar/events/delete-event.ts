import { Context } from "koa";
import { ObjectID } from "bson";
import { Salon } from "../../../models/salon";
import { ReservationsCollection } from "../../../adapters/mongodb";

export async function deleteEvent(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const query = ctx.query || {};
  const reservationId = query.rid || query.id;

  // id to reservation should be valid
  ctx.assert(ObjectID.isValid(reservationId), 404, "Item doesn't exist");

  const $reservations = await ReservationsCollection();
  const result = await $reservations.deleteOne({
    _id: new ObjectID(reservationId),
    salonId: salon._id
  });

  ctx.assert(result.deletedCount > 0, 404, "Item doesn't exist");

  ctx.body = "ok";
}
