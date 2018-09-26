import { SalonEvent } from '../../models/salon-event'
import { SalonUser } from '../../models/salon-user'
import { SalonService } from '../../models/salon-service';

export interface EventDialog {
  salonId: number;
  error?: Error;
  event?: SalonEvent;
  salonUsers?: SalonUser[];
  salonServices?: SalonService[];
}
