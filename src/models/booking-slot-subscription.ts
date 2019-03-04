import { ObjectID } from "bson";
import { Date as DateObject } from "./date";

export interface BookingSlotSubscription {
  _id: ObjectID;
  subscriberId: ObjectID;
  salonId: ObjectID;
  date: DateObject;
  userId: ObjectID | null;
  serviceId: number | null;
  updatedAt: Date;
}
