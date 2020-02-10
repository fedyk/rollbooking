import { Db } from "mongodb";
import { Reservation } from "./types/reservation"

export function getCollection(db: Db) {
  return db.collection<Reservation>("reservations")
}

export function create(db: Db, reservation: Reservation) {
  return getCollection(db).insertOne(reservation).then(r => r.insertedId);
}

export function getById(db: Db, id: string) {
  return getCollection(db).findOne({ id })
}
