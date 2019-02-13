import { Context } from "koa";
import { ReservationsCollection } from "../../../adapters/mongodb";
import { Salon, SalonService } from "../../../models/salon";
import { Reservation, Status as ReservationStatus } from "../../../models/reservation";
import { isoDateTimeToDateTime } from "../../../helpers/date/iso-date-time-to-date-time";
import { reservationToEvent } from "../helpers/reservation-to-event";

export async function create(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const body = ctx.request.body || {} as any;
  const master = salon.employees.users.find(v => v.id.toHexString() === body.masterId);
  const reservation = {
    salonId: salon._id,
    clientId: null,
    masterId: master ? master.id : null,
    serviceId: null,
    start: isoDateTimeToDateTime(body.start),
    end: isoDateTimeToDateTime(body.end),
    status: ReservationStatus.Confirmed,
  } as Reservation;

  ctx.assert(reservation.masterId, 400, "Master is required");
  ctx.assert(reservation.start, 400, "Start date is required");
  ctx.assert(reservation.end, 400, "End date is required");
  ctx.assert(reservation.start, 400, "Reservation status is required");

  const $reservations = await ReservationsCollection();
  const { insertedId } = await $reservations.insertOne(reservation);
  
  reservation._id = insertedId;
  
  const servicesMap = new Map<number, SalonService>(salon.services.items.map(function(service): [number, SalonService] {
    return [service.id, service];
  }));

  const usersMap = new Map();

  ctx.body = reservationToEvent(reservation, servicesMap, usersMap);
}
