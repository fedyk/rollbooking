import { Reservation } from "../../../models/reservation";
import { SalonService } from "../../../models/salon";
import { dateTimeToISODate } from "../../../helpers/date/date-time-to-iso-date";

export function reservationToEvent(reservation: Reservation, salonServices: Map<number, SalonService>) {
  const title = salonServices.has(reservation.serviceId) ? salonServices.get(reservation.serviceId).name : "Reservation";

  return {
    id: reservation._id.toHexString(),
    title: title,
    start: dateTimeToISODate(reservation.start),
    end: dateTimeToISODate(reservation.end),
    resourceId: reservation.masterId.toHexString()
  }
}
