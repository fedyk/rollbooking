import { bookingLayoutView } from "../../views/booking/booking-layout-view";
import { Context } from "koa";
import { ReservationsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";
import { Salon } from "../../models/salon";
import { User } from "../../models/user";
import { getUserAvatarUrl } from "../../helpers/user/get-user-avatar-url";

export async function reservation(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const reservationId = ctx.query.id as string;
  const isAuthenticated = ctx.isAuthenticated();
  const user = isAuthenticated ? (ctx.user as User) : null;
  const $reservations = await ReservationsCollection();

  ctx.assert(ObjectID.isValid(reservationId), 404, "Page doesn't exist");

  const reservation = await $reservations.findOne({
    salonId: salon._id,
    _id: new ObjectID(reservationId)
  })

  ctx.assert(reservation, 404, "Reservation doesn't exist")

  ctx.body = bookingLayoutView({
    isAuthenticated: ctx.isAuthenticated(),
    userName: user ? user.name : null,
    userAvatarUrl: user ? getUserAvatarUrl(user) : null,
    salonAlias: salon.alias,
    salonName: salon.name,
    body: `<pre>${JSON.stringify(reservation, null, 2)}</pre>`
  })
}
