import { SalonEvent } from '../../models/salon-event'
import { SalonUser } from '../../models/salon-user'

export interface EventDialog {
  error?: Error;
  event?: SalonEvent;
  salonUsers?: SalonUser[];
}
