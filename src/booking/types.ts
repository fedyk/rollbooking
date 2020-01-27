import { DateTime } from "../types";

export interface Slot {
  start: DateTime;
  end: DateTime;
  userId: string;
  serviceId: number;
}
