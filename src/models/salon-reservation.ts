import { Date } from "./date";

enum Status {
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
}

export interface SalonReservation {
  salon_id: number;
  master_id: number;
  service_id: number;
  start_date: Date;
  start_time: number;
  end_date: Date;
  end_time: number;
  properties: SalonReservationProperties;
}

interface SalonReservationProperties {
  general: {
    status: Status;
  }
}
