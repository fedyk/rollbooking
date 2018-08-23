import Salon from "../../models/salon";
import SalonUser from "../../models/salon-user";
import SalonEvents from "../../models/salon-event";

export interface ScheduleData {
  salonId: number;
  salon: Salon;
  salonUsers: SalonUser[];
  salonEvents: SalonEvents[];
}
