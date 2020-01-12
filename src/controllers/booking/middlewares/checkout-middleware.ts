import { Context } from "koa";
import { Salon, SalonService } from "../../../core/types/salon";
import { parseCheckoutRequestQuery } from "../helpers/parse-checkout-request-query";
import { BookingSlotsCollection_DEPRECATED, UsersCollection_DEPRECATED } from "../../../core/db/mongodb";
import { User } from "../../../core/types/user";
import { SessionPayload } from "../../../core/types/session";
import { BookingSlot } from "../../../core/types/booking-slot";

export interface CheckoutState {
  salon?: Salon;
  user?: User;
  bookingSlot: BookingSlot;
  userName: string;
  userEmail: string;
  salonMaster: User;
  salonService: SalonService;
}

export interface CheckoutContext extends Context {
  state: CheckoutState
}

/**
 * @example
 * ```
 * router.get("/", checkoutMiddleware, (ctx) => console.log(ctx.state.bookingSlot))
 * ``
 */
export async function checkoutMiddleware(ctx: CheckoutContext, next) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const session = ctx.session as SessionPayload;
  const params = parseCheckoutRequestQuery(ctx.query);
  const isAuthenticated = ctx.isAuthenticated();
  
  ctx.assert(params.slotId, 404, "Page does not exist");

  const $bookingSlots = await BookingSlotsCollection_DEPRECATED();
  const bookingSlot = await $bookingSlots.findOne({
    _id: params.slotId,
    salonId: salon._id
  });

  ctx.assert(bookingSlot, 404, "Time is already booked");

  const $users = await UsersCollection_DEPRECATED();
  const salonMaster = await $users.findOne({
    _id: bookingSlot.userId
  });

  ctx.assert(salonMaster, 404, "Looks like master does not exist");

  const salonService = salon.services.items.find(v => v.id === bookingSlot.serviceId);

  ctx.assert(salonService, 404, "Looks salon does not have requested service");

  ctx.state.bookingSlot = bookingSlot;
  ctx.state.userName = isAuthenticated ? user.name : session.clientName;
  ctx.state.userEmail = isAuthenticated ? user.email : session.clientEmail;
  ctx.state.salonMaster = salonMaster;
  ctx.state.salonService = salonService

  await next();
}
