import { Context } from "koa";
import { Salon } from "../../../models/salon";
import { BookingSlotsSubscriptionCollection, ClientsCollection } from "../../../adapters/mongodb";
import { SessionPayload } from "../../../models/session";
import { User } from "../../../models/user";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";
import { toDottedObject } from "../../../helpers/to-dotted-object";
import { BookingSlotSubscription } from "../../../models/booking-slot-subscription";
import { ObjectID } from "bson";
import { parseSlotSubscriptionBody } from "../helpers/parse-slot-subscription-body";

enum Actions {
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}

export async function subscribe(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const user = ctx.state.user as User;
  const params = parseSlotSubscriptionBody(ctx.request.body);

  ctx.assert(Object.values(Actions).includes(params.action), 400, "Invalid action value");
  ctx.assert(params.date, 400, "Invalid date value");

  const $bookingSlotsSubscription = await BookingSlotsSubscriptionCollection();

  const filter = {
    subscriberId: user._id,
    salonId: salon._id,
    date: params.date,
    serviceId: params.serviceId,
    userId: params.userId,
  };

  if (params.action === Actions.SUBSCRIBE) {
    const bookingSlot: BookingSlotSubscription = Object.assign({
      updat
    }, filter)

    await $bookingSlotsSubscription.findOneAndReplace(toDottedObject(filter), , {
      upsert: true
    })
  }

  const bookingSlotsSubscription = 

  if (!bookingSlotsSubscription) {
    await $bookingSlotsSubscription.insert(toDottedObject({
      salonId: salon._id,
      userId: user._id,
      date: date
    }))
  }
}
