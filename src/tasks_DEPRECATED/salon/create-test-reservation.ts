import { ObjectID } from "bson";
import { closeClient, ReservationsCollection_DEPRECATED } from "../../core/db/mongodb";
import { Reservation, Status } from "../../core/types/reservation";
import { nativeDateToDateTime } from "../../helpers/date/native-date-to-date-time";

interface Options {
  salonId: ObjectID,
  masterId: ObjectID,
  date?: Date
}

export async function createTestReservation(options: Options) {
  const $reservations = await ReservationsCollection_DEPRECATED();
  const date = options.date || new Date();
  const start = nativeDateToDateTime(date);
  const end = nativeDateToDateTime(date);

  start.hours = 10;
  start.minutes = 0;
  start.seconds = 0;
  
  end.hours = 11;
  end.minutes = 0;
  end.seconds = 0;

  const reservation: Reservation = {
    salonId: options.salonId,
    masterId: options.masterId,
    clientId: null,
    serviceId: null,
    start,
    end,
    status: Status.Confirmed,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const { ops: [insertedReservation] } = await $reservations.insertOne(reservation);

  return insertedReservation as Reservation;
}

if (!module.parent) {
  const salonId = new ObjectID(process.argv[2])
  const masterId = new ObjectID(process.argv[3])
  createTestReservation({ salonId, masterId })
    .then(reservation => console.log("Test reservation was successfully created: reservationId=%s", reservation._id))
    .catch(error => console.error(error))
    .then(() => closeClient())
}
