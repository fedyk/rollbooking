import { ObjectID } from "bson";
import { DateTime } from "./date-time";

export interface BookingSlot {
  _id?: ObjectID;
  _version: "v1";
  salonId: ObjectID;
  userId: ObjectID;
  serviceId: number;
  start: DateTime;
  end: DateTime;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Example entity
 */
const bookingSlot: BookingSlot = {
  _id: new ObjectID("12345678"),
  _version: "v1",
  salonId: new ObjectID("salon-id"),
  userId: new ObjectID("user-id"),
  serviceId: 1,
  start: {
    year: 2018,
    month: 12,
    day: 30,
    hours: 10,
    minutes: 0,
    seconds: 0,
  },
  end: {
    year: 2018,
    month: 12,
    day: 30,
    hours: 11,
    minutes: 0,
    seconds: 0,
  }
}
