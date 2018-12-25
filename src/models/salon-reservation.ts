export interface SalonReservation {
  salon_id: number;
  user_id: number;
  master_id: number;
  service_id: number;
  start: Date;
  end: Date;
  status: Status;
}

enum Status {
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
}
