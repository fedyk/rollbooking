import { Date } from "../../../models/date";
import { Salon, SalonService } from "../../../models/salon";
import { ReservationsCollection, UsersCollection } from "../../../adapters/mongodb";
import { reservationToEvent } from "./reservation-to-event";
import { User } from "../../../models/user";

export async function getEvents(salon: Salon, date: Date) {
  const $reservations = await ReservationsCollection();
  const $users = await UsersCollection();

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

  const usersIds = reservations.filter(function(reservation) {
    return !!reservation.userId;
  }).map(function(reservation) {
    return reservation.userId;
  });

  const users = await $users.find({
    _id: {
      $in: usersIds
    }
  }).toArray();

  const usersMap = new Map<string, User>(users.map(function(user): [string, User] {
    return [user._id.toHexString(), user];
  }));

  return reservations.map(function(reservation) {
    return reservationToEvent(reservation, servicesMap, usersMap);
  });
}