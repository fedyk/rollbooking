import { Reservation } from "../../../models/reservation";
import { SalonService } from "../../../models/salon";
import { dateTimeToISODate } from "../../../helpers/date/date-time-to-iso-date";
import { ObjectID } from "bson";
import { User } from "../../../models/user";

export function reservationToEvent(
  reservation: Reservation,
  salonServices: Map<number, SalonService>,
  users: Map<string, User>
) {
  const title = salonServices.has(reservation.serviceId) ? salonServices.get(reservation.serviceId).name : "Reservation";
  const serviceName = salonServices.has(reservation.serviceId) ? salonServices.get(reservation.serviceId).name : "";
  const userId = ObjectID.isValid(reservation.userId) ? reservation.userId.toHexString() : null;
  const userName = users.has(userId) ? users.get(userId).name : ""

  return {
    id: reservation._id.toHexString(),
    title: title,
    start: dateTimeToISODate(reservation.start),
    end: dateTimeToISODate(reservation.end),
    resourceId: reservation.masterId.toHexString(),
    serviceId: reservation.serviceId,
    serviceName,
    userId,
    userName,
  }
}
