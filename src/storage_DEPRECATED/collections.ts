// import { Db } from "mongodb";
// import { Client } from "../clients/types";
// import { Session } from "../sessions/types";
// import { User, Business } from "../accounts";

// type Mongo$User = Omit<User, "id">
// type Mongo$Business = Omit<Business, "id">

// export function getAccountsCollections(db: Db) {
//   return db.collection<Mongo$User | Mongo$Business>("accounts")
// }

// export type Clients = ReturnType<typeof getClientsCollections>

// export function getClientsCollections(db: Db) {
//   return db.collection<Client>("clients")
// }

// export type Sessions = ReturnType<typeof getSessionsCollections>

// export function getSessionsCollections(db: Db) {
//   return db.collection<Session>("sessions")
// }

// export type Events = ReturnType<typeof getEventsCollections>

// export function getEventsCollections(db: Db) {
//   return db.collection<any>("sessions")
// }
