import { ObjectID } from "bson";
import { FilterQuery } from "mongodb";
import { Date } from "../../../models/date";
import { BookingSlot } from "../../../models/booking-slot";

interface Params {
  date?: Date;
  userId?: ObjectID;
  salonId: ObjectID;
  serviceId?: number;
}

export function getBookingSlotsFilter({ salonId, userId, serviceId, date }: Params) {
  const filter: FilterQuery<BookingSlot> = {
    salonId: salonId
  }

  if (userId != null) {
    filter.userId = userId;
  }

  if (serviceId != null) {
    filter.serviceId = serviceId;
  }

  if (date != null) {
    filter["$and"] = [
      {
        "start.year": {
          $lte: date.year
        },
        "start.month": {
          $lte: date.month
        },
        "start.day": {
          $lte: date.day
        }
      },
      {
        "end.year": {
          $gte: date.year
        },
        "end.month": {
          $gte: date.month
        },
        "end.day": {
          $gte: date.day
        }
      }
    ]
  }

  return filter;
}
