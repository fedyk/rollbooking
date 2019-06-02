import { Context } from "koa";
import { ObjectID } from "bson";
import { Salon, SalonService } from "../../../types/salon";
import { ReservationsCollection, ClientsCollection } from "../../../adapters/mongodb";
import { reservationToEvent } from "../helpers/reservation-to-event";
import { isoDateTimeToDateTime } from "../../../helpers/date/iso-date-time-to-date-time";
import { Reservation, Status } from "../../../types/reservation";
import { toDottedObject } from "../../../helpers/to-dotted-object";
import { indexBy } from "../helpers/index-by";
import { syncBookingSlots } from "../../../tasks/salon/sync-booking-slots";
import { dateTimeToNativeDate } from "../../../helpers/date/date-time-to-native-date";

export async function update(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const body = ctx.request.body || {} as any;

  // id to reservation should be valid
  ctx.assert(ObjectID.isValid(body.id), 404, "Item doesn't exist");

  const master = salon.employees.users.find(v => v.id.toHexString() === body.masterId);
  const service = salon.services.items.find(v => v.id === body.serviceId);
  const start = isoDateTimeToDateTime(body.start);
  const end = isoDateTimeToDateTime(body.end);
  const clientId = ObjectID.isValid(body.clientId) ? new ObjectID(body.clientId) : null;
  const status = Object.values(Status).includes(body.status) ? body.status : null;

  const partialReservation: Partial<Reservation> = {}

  if (master) {
    partialReservation.masterId = master.id;
  }

  if (service) {
    partialReservation.serviceId = service.id;
  }

  if (start) {
    partialReservation.start = start;
  }

  if (end) {
    partialReservation.end = end;
  }

  if (clientId) {
    partialReservation.clientId = clientId;
  }

  if (status) {
    partialReservation.status = status;
  }

  const $reservations = await ReservationsCollection();

  const updatedReservation = await $reservations.findOneAndUpdate({
    _id: new ObjectID(body.id),
    salonId: salon._id
  }, {
    $set: partialReservation
  }, {
    returnOriginal: false
  });

  // no update item, looks like it doesn't exist
  ctx.assert(updatedReservation.ok, 500, updatedReservation.lastErrorObject);

  // update slots for current day
  await syncBookingSlots(salon._id);

  const servicesMap = indexBy<number, SalonService>(salon.services.items, "id");
  const usersMap = new Map();

  if (ObjectID.isValid(updatedReservation.value.clientId)) {
    const $clients = await ClientsCollection();
    const client = await $clients.findOne({
      _id: updatedReservation.value.clientId
    });

    if (client) {
      usersMap.set(client._id.toHexString(), client);
    }
  }

  ctx.body = reservationToEvent(updatedReservation.value, servicesMap, usersMap);
}
