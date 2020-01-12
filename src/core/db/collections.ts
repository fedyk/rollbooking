import { Db } from "mongodb";
import { User, Business } from "../accounts/types";
import { Client } from "../clients/types";
import { Session } from "../sessions/types";

export function AccountsCollection(db: Db) {
  return db.collection<User | Business>("accounts")
}

export function ClientsCollections(db: Db) {
  return db.collection<Client>("accounts")
}

export function SessionsCollection(db: Db) {
  return db.collection<Session>("sessions")
}

export function EventsCollection(db: Db) {
  return db.collection<any>("sessions")
}
