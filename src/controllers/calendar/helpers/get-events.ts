import { Date } from "../../../models/date";
import { Salon, SalonService } from "../../../models/salon";
import { ReservationsCollection, ClientsCollection } from "../../../adapters/mongodb";
import { reservationToEvent } from "./reservation-to-event";
import { Client } from "../../../models/client";
import { ObjectID } from "bson";

export async function getEvents(salon: Salon, date: Date) {
  const $reservations = await ReservationsCollection();
  const $clients = await ClientsCollection();

  // TODO cover this params by TS
  const reservations = await $reservations.find({
    salonId: salon._id,
    $or: [{
      "start.year": date.year,
      "start.month": date.month,
      "start.day": date.day
    }, {
      "end.year": date.year,
      "end.month": date.month,
      "end.day": date.day
    }]
  }).toArray();

  const servicesMap = new Map<number, SalonService>(salon.services.items.map(function(service): [number, SalonService] {
    return [service.id, service];
  }));

  const clientsIds = reservations.filter(reservation => ObjectID.isValid(reservation.clientId)).map(reservation => reservation.clientId);

  const clients = clientsIds.length > 0 ? await $clients.find({
    _id: {
      $in: clientsIds
    }
  }).toArray() : [];

  const clientsMap = new Map<string, Client>(clients.map(function(client): [string, Client] {
    return [client._id.toHexString(), client];
  }));

  const events = reservations.map(function(reservation) {
    return reservationToEvent(reservation, servicesMap, clientsMap);
  });

  return {
    events,
    clients
  }
}