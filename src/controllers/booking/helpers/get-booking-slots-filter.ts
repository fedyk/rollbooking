import { ObjectID } from "bson";
import { FilterQuery } from "mongodb";
import { Date } from "../../../models/date";
import { BookingSlot } from "../../../models/booking-slot";
import { toDottedObject } from "../../../helpers/to-dotted-object";

interface Params {
  salonId: ObjectID;
  userId?: ObjectID;
  serviceId?: number;
  date?: Date
}

export async function getBookingSlotsFilter({ salonId, userId, serviceId, date }: Params) {
  const filter: FilterQuery<BookingSlot> = {
    salonId: salonId
  }

  if (userId != null) {
    filter.userId = userId;
  }

  if (serviceId != null) {
    filter.serviceId = null;
  }

  if (date != null) {
    filter["$or"] = [toDottedObject({
      start: date
    }), toDottedObject({
      end: date
    })]
  }

  return filter;
}
