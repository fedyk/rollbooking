import { Context } from "koa";
import { Salon } from "../../../models/salon";
import { User } from "../../../models/user";
import { SessionPayload } from "../../../models/session";
import { checkoutView } from "../../../views/booking/checkout-view";
import { bookingLayoutView } from "../../../views/booking/booking-layout-view";
import { parseCheckoutRequestQuery } from "../helpers/parse-checkout-request-query";
import { UsersCollection, BookingSlotsCollection } from "../../../adapters/mongodb";
import { dateTimeToNativeDate } from "../../../helpers/date/date-time-to-native-date";

export async function get(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const isAuthenticated = ctx.isAuthenticated();
  const params = parseCheckoutRequestQuery(ctx.query);
  const session = ctx.session as SessionPayload;
  const userName = isAuthenticated ? (user.name) : session.clientName;
  const userEmail = isAuthenticated ? user.email : session.clientEmail;
  const $users = await UsersCollection();
  const $bookingSlots = await BookingSlotsCollection();

  ctx.assert(params.slotId, 404, "Page does not exist");

  const bookingSlot = await $bookingSlots.findOne({ _id: params.slotId });

  ctx.assert(bookingSlot, 404, "Time is already booked");

  const salonMaster = await $users.findOne({ _id: bookingSlot.userId });

  ctx.assert(salonMaster, 404, "Oops, something went wrong");

  const salonService = salon.services.items.find(v => v.id === bookingSlot.serviceId);

  ctx.assert(salonService, 400, "Invalid params");

  ctx.body = bookingLayoutView({
    salonName: salon.name,
    salonAlias: salon.alias,
    body: checkoutView({
      isAuthenticated: isAuthenticated,
      userName: userName,
      userEmail: userEmail,
      bookingMasterName: salonMaster.name,
      bookingServiceName: salonService.name,
      bookingDate: dateTimeToNativeDate(bookingSlot.start).toLocaleString()
    })
  })
}
