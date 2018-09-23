import { SalonEvent } from '../../models/salon-event'
import { SalonUser } from '../../models/salon-user'

export interface EventDialog {
  salonId: number;

  error?: Error;
  event?: SalonEvent;
  salonUsers?: SalonUser[];
}
