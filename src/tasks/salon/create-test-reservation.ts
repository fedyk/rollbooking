import { ObjectID } from "bson";
import { closeClient, ReservationsCollection } from "../../adapters/mongodb";
import { Reservation, Status } from "../../models/reservation";
import { nativeDateToDateTime } from "../../helpers/date/native-date-to-date-time";

interface Options {
  salonId: ObjectID,
  masterId: ObjectID
}

export async function createTestReservation(options: Options) {
  const $reservations = await ReservationsCollection();
  const now = new Date();
  const start = nativeDateToDateTime(now);
  const end = nativeDateToDateTime(now);

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
