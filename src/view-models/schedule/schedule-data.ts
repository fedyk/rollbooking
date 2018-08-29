import Salon from "../../models/salon";
import { User } from "../../models/user";
import SalonUser from "../../models/salon-user";
import SalonEvents from "../../models/salon-event";
import { Resource as FullCalendarResource } from "../fullcalendar/resource";

export interface ScheduleData {
  user: User;
  salonId: number;

  error?: any;
  
  salon?: Salon;
  salonUsers?: SalonUser[];
  salonEvents?: SalonEvents[];

  resources?: FullCalendarResource[]
}
