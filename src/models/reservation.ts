import { ObjectID } from "bson";

export interface Reservation {
  salonId: string;
  userId: string;
  masterId: string;
  serviceId: number;
  start: Date;
  end: Date;
  status: Status;
}

enum Status {
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
}
