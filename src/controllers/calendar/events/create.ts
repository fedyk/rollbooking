import { Context } from "koa";
import { ReservationsCollection } from "../../../adapters/mongodb";
import { Salon, SalonService } from "../../../models/salon";
import { Reservation, Status as ReservationStatus } from "../../../models/reservation";
import { isoDateTimeToDateTime } from "../../../helpers/date/iso-date-time-to-date-time";
import { ok } from "assert";
import { reservationToEvent } from "../helpers/reservation-to-event";

export async function create(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const body = ctx.request.body || {} as any;
  const master = salon.employees.users.find(v => v.id.toHexString() === body.resourceId);
  const reservation = {
    salonId: salon._id,
    userId: null,
    masterId: master ? master.id : null,
    serviceId: null,
    start: isoDateTimeToDateTime(body.start),
    end: isoDateTimeToDateTime(body.end),
    status: ReservationStatus.Confirmed,
  } as Reservation;

  ok(reservation.masterId, "Master is required");
  ok(reservation.start, "Start date is required");
  ok(reservation.end, "End date is required");
  ok(reservation.start, "Reservation status is required");

  const $reservations = await ReservationsCollection();
  const { insertedId } = await $reservations.insertOne(reservation);
  
  reservation._id = insertedId;
  
  const servicesMap = new Map<number, SalonService>(salon.services.items.map(function(service): [number, SalonService] {
    return [service.id, service];
  }));

  const usersMap = new Map();

  ctx.body = reservationToEvent(reservation, servicesMap, usersMap);
}
