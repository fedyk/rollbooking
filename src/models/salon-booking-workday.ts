import { ObjectID } from "bson";
import { BookingWorkday } from "./booking-workday";

export interface SalonBookingWorkday extends BookingWorkday {
  salonId: ObjectID;
  created?: Date;
}
