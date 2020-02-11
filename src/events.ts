import { Db, FilterQuery } from "mongodb";
import { DateTime } from "./types";

export interface Event {
  id: string
  businessId: string
  clientId: string
  userId: string
  serviceId: string
  start: DateTime
  end: DateTime
  status: Status
  timezone?: string
  createdAt: Date
  updatedAt: Date
}

export enum Status {
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
  Deleted = 4,
}

export function getCollection(db: Db) {
  return db.collection<Event>("events")
}

export function create(db: Db, reservation: Event) {
  return getCollection(db).insertOne(reservation)
}

export function findOne(db: Db, query: FilterQuery<Event>) {
  return getCollection(db).findOne(query)
}
