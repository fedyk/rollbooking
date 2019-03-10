import { Context } from "koa";
import { User } from "../../../models/user";
import { Salon } from "../../../models/salon";
import { toDottedObject } from "../../../helpers/to-dotted-object";
import { BookingSlotSubscription } from "../../../models/booking-slot-subscription";
import { parseSlotSubscriptionBody } from "../helpers/parse-slot-subscription-body";
import { BookingSlotsSubscriptionCollection } from "../../../adapters/mongodb";
import { getBookingSlotsSubscriptionFilter } from "../helpers/get-booking-slots-subscription-filter";

enum Actions {
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}

export async function slotSubscriptions(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const params = parseSlotSubscriptionBody(ctx.request.body);

  ctx.assert(Object.values(Actions).includes(params.action), 400, "Invalid action value");
  ctx.assert(params.date, 400, "Invalid date value");

  const $bookingSlotsSubscription = await BookingSlotsSubscriptionCollection();

  const filter = getBookingSlotsSubscriptionFilter({
    subscriberId: user._id,
    salonId: salon._id,
    date: params.date,
    serviceId: params.serviceId,
    userId: params.userId,
  });

  if (params.action === Actions.SUBSCRIBE) {
    const bookingSlot: BookingSlotSubscription = {
      subscriberId: user._id,
      salonId: salon._id,
      date: params.date,
      serviceId: params.serviceId,
      userId: params.userId,
      updatedAt: new Date()
    }

    await $bookingSlotsSubscription.findOneAndReplace(filter, bookingSlot, {
      upsert: true
    })
  }
  
  if (params.action === Actions.UNSUBSCRIBE) {
    await $bookingSlotsSubscription.deleteOne(filter);
  }

  if (ctx.request.is("application/x-www-form-urlencoded")) {
    ctx.redirect("back");
  }

  ctx.body = "ok";
}
