import SalonUser from "../models/salon-user";
import { Resource as FullCalendarResource } from "../view-models/fullcalendar/resource";
import getUserName from "./get-user-name";

export function salonUsersToResources(users: SalonUser[]): FullCalendarResource[] {
  return users.map(v => salonUserToResource(v));
}

export function salonUserToResource(user: SalonUser): FullCalendarResource {
  return {
    id: user.user_id,
    title: getUserName(user),
  }
}