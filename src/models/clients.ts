import { Db } from "mongodb";

export interface Client {
  id: string
  businessId: string;
  name: string;
  email?: string;
  phone?: string;
  created?: Date;
  updated?: Date;
}

export function getCollection(db: Db) {
  return db.collection<Client>("clients")
}

export function create(db: Db, user: Client) {
  return getCollection(db).insertOne(user).then(r => r.insertedId);
}

export function getById(db: Db, id: string) {
  return getCollection(db).findOne({ id })
}
