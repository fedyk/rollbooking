import { ObjectID } from "bson";
import { FilterQuery } from "mongodb";
import { Date } from "../../../base/types/date";
import { BookingSlotSubscription } from "../../../base/types/booking-slot-subscription";

interface Params {
  salonId: ObjectID;
  subscriberId: ObjectID;
  date: Date;
  serviceId?: number;
  userId?: ObjectID;
}

export function getBookingSlotsSubscriptionFilter(params: Params) {
  const filter: FilterQuery<BookingSlotSubscription> = {
    salonId: params.salonId,
    subscriberId: params.subscriberId,
    date: {
      year: params.date.year,
      month: params.date.month,
      day: params.date.day,
    }
  }

  if (params.serviceId != null) {
    filter.serviceId = params.serviceId;
  }

  if (params.userId != null) {
    filter.userId = params.userId;
  }

  return filter;
}
