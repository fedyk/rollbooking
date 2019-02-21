import { ObjectID } from "bson";
import { DateTime } from "./date-time";

export interface Reservation {
  _id?: ObjectID;
  salonId: ObjectID;
  clientId: ObjectID;
  userId?: ObjectID;
  masterId: ObjectID;
  serviceId: number;
  start: DateTime;
  end: DateTime;
  status: Status;
  meta?: ReservationMeta;
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
  Deleted = 4,
}

interface ReservationMeta {

  /**
   * For debugging purpose lets store timezone at the moment of creating.
   */
  timezone?: string;

  /**
   * For debugging purpose lets store offset from UTC time. This should help to provide
   * a better experience in case of changes with DST on some time zone
   */
  utcOffset?: number;
}

/**
 * Example of data structure
 */
const reservation: Reservation = {
  salonId: new ObjectID("5c2715c874a20f11b784517a"),
  clientId: new ObjectID("5c2715c874a20f11b784517b"),
  masterId: new ObjectID("5c2715c874a20f11b784517b"),
  serviceId: 1,
  start: {
    year: 2018,
    month: 12,
    day: 30,
    hours: 13,
    minutes: 0,
    seconds: 0
  },
  end: {
    year: 2018,
    month: 12,
    day: 30,
    hours: 14,
    minutes: 0,
    seconds: 0
  },
  status: Status.Confirmed,
  meta: {
    timezone: "Europe/Berlin",
    utcOffset: -60
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}
