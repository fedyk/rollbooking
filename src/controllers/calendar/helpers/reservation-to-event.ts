import { ObjectID } from "bson";
import { Reservation } from "../../../models/reservation";
import { SalonService } from "../../../models/salon";
import { dateTimeToISODate } from "../../../helpers/date/date-time-to-iso-date";
import { Client } from "../../../models/client";

export function reservationToEvent(
  reservation: Reservation,
  salonServices: Map<number, SalonService>,
  clientsMap: Map<string, Client>
) {
  const title = salonServices.has(reservation.serviceId) ? salonServices.get(reservation.serviceId).name : "Reservation";
  const serviceName = salonServices.has(reservation.serviceId) ? salonServices.get(reservation.serviceId).name : "";
  const clientId = ObjectID.isValid(reservation.clientId) ? reservation.clientId.toHexString() : null;
  const clientName = clientsMap.has(clientId) ? clientsMap.get(clientId).name : "";

  return {
    id: reservation._id.toHexString(),
    title: title,
    start: dateTimeToISODate(reservation.start),
    end: dateTimeToISODate(reservation.end),
    masterId: reservation.masterId.toHexString(),
    serviceId: reservation.serviceId,
    serviceName,
    clientId,
    clientName,
  }
}
