import { Collection, Db, ObjectID } from "mongodb";

export interface Session {
  body: string
  expiresAt: Date
  createdAt: Date
}

/**
 * TBD
 */
export class Sessions {
  collection: Collection<Session>

  constructor(db: Db) {
    this.collection = db.collection("sessions")
  }

  // generateId() {
  //   return new ObjectID().toHexString()
  // }

  // get(id: String) {
  //   return this.collection.findOne(ObjectID(id)).then
  // }

  // create(id: string, session: Session) {
  //   return this.collection.insertOne(Object.assign({
  //     session
  //   })
  // }

  // delete(_id: ObjectID) {
  //   return this.collection.deleteOne({
  //     _id
  //   })
  // }
}
